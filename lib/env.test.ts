import { afterEach, describe, expect, it, vi } from "vitest";

import { serverEnvSchema } from "@/lib/env";

describe("serverEnvSchema", () => {
  it("accepts PostgreSQL and sufficiently long authentication secrets", () => {
    const result = serverEnvSchema.safeParse({
      DATABASE_URL: "postgresql://user:password@example.com/taskflow",
      AUTH_SECRET: "a-secure-secret-with-at-least-32-characters",
    });

    expect(result.success).toBe(true);
  });

  it("rejects local files and short secrets", () => {
    const result = serverEnvSchema.safeParse({
      DATABASE_URL: "file:./dev.db",
      AUTH_SECRET: "short",
    });

    expect(result.success).toBe(false);
  });
});

describe("getServerEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns validated runtime values", async () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://user:password@example.com/taskflow",
    );
    vi.stubEnv("AUTH_SECRET", "a-secure-secret-with-at-least-32-characters");

    const { getServerEnv } = await import("@/lib/env");

    expect(getServerEnv()).toEqual({
      DATABASE_URL: "postgresql://user:password@example.com/taskflow",
      AUTH_SECRET: "a-secure-secret-with-at-least-32-characters",
    });
    expect(getServerEnv()).toBe(getServerEnv());
  });

  it("fails early when required values are unsafe", async () => {
    vi.stubEnv("DATABASE_URL", "file:./dev.db");
    vi.stubEnv("AUTH_SECRET", "short");

    const { getServerEnv } = await import("@/lib/env");

    expect(() => getServerEnv()).toThrow("Invalid server environment");
  });
});
