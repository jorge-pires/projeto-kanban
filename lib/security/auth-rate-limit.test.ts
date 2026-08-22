import { beforeEach, describe, expect, it, vi } from "vitest";

const databaseMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deleteMany: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    DATABASE_URL: "postgresql://test:test@localhost/taskflow",
    AUTH_SECRET: "test-secret-with-at-least-32-characters",
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: databaseMocks.transaction,
    authAttempt: {
      deleteMany: databaseMocks.deleteMany,
    },
  },
}));

import {
  clearAuthRateLimit,
  consumeAuthRateLimit,
} from "@/lib/security/auth-rate-limit";

describe("authentication rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    databaseMocks.transaction.mockImplementation(async (callback) =>
      callback({
        authAttempt: {
          findUnique: databaseMocks.findUnique,
          create: databaseMocks.create,
          update: databaseMocks.update,
        },
      }),
    );
  });

  it("creates a hashed record for the first attempt", async () => {
    databaseMocks.findUnique.mockResolvedValue(null);

    const result = await consumeAuthRateLimit({
      action: "login",
      identifier: "203.0.113.10",
      maxAttempts: 5,
      windowMs: 60_000,
    });

    expect(result.allowed).toBe(true);
    expect(databaseMocks.create).toHaveBeenCalledOnce();

    const data = databaseMocks.create.mock.calls[0]?.[0].data;

    expect(data.identifierHash).toMatch(/^[a-f0-9]{64}$/);
    expect(data.identifierHash).not.toContain("203.0.113.10");
  });

  it("blocks attempts until an active window expires", async () => {
    databaseMocks.findUnique.mockResolvedValue({
      id: "attempt-1",
      attempts: 5,
      resetAt: new Date(Date.now() + 60_000),
    });

    const result = await consumeAuthRateLimit({
      action: "login",
      identifier: "203.0.113.10",
      maxAttempts: 5,
      windowMs: 60_000,
    });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(databaseMocks.create).not.toHaveBeenCalled();
    expect(databaseMocks.update).not.toHaveBeenCalled();
  });

  it("resets an expired attempt window", async () => {
    databaseMocks.findUnique.mockResolvedValue({
      id: "attempt-1",
      attempts: 5,
      resetAt: new Date(Date.now() - 1_000),
    });

    const result = await consumeAuthRateLimit({
      action: "login",
      identifier: "203.0.113.10",
      maxAttempts: 5,
      windowMs: 60_000,
    });

    expect(result.allowed).toBe(true);
    expect(databaseMocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ attempts: 1 }),
      }),
    );
  });

  it("increments an active window below the limit", async () => {
    databaseMocks.findUnique.mockResolvedValue({
      id: "attempt-1",
      attempts: 2,
      resetAt: new Date(Date.now() + 60_000),
    });

    const result = await consumeAuthRateLimit({
      action: "login",
      identifier: "203.0.113.10",
      maxAttempts: 5,
      windowMs: 60_000,
    });

    expect(result.allowed).toBe(true);
    expect(databaseMocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ attempts: { increment: 1 } }),
      }),
    );
  });

  it("clears only the hashed identifier after a successful login", async () => {
    await clearAuthRateLimit("login", "203.0.113.10");

    expect(databaseMocks.deleteMany).toHaveBeenCalledWith({
      where: {
        action: "login",
        identifierHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      },
    });
  });
});
