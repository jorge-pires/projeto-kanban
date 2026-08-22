import { describe, expect, it } from "vitest";

import {
  createRateLimitKey,
  getClientAddress,
  getRetryAfterSeconds,
} from "@/lib/security/rate-limit-helpers";

describe("rate-limit helpers", () => {
  it("uses the first trusted forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 198.51.100.2",
    });

    expect(getClientAddress(headers)).toBe("203.0.113.10");
  });

  it("does not store the raw identifier in the rate-limit key", () => {
    const key = createRateLimitKey(
      "login-account",
      "person@example.com",
      "test-secret",
    );

    expect(key).toMatch(/^[a-f0-9]{64}$/);
    expect(key).not.toContain("person@example.com");
  });

  it("normalizes equivalent identifiers", () => {
    const firstKey = createRateLimitKey("login", " User@Example.com ", "secret");
    const secondKey = createRateLimitKey("login", "user@example.com", "secret");

    expect(firstKey).toBe(secondKey);
  });

  it("rounds retry time up to whole seconds", () => {
    const now = new Date("2026-08-22T12:00:00.000Z");
    const resetAt = new Date("2026-08-22T12:00:01.100Z");

    expect(getRetryAfterSeconds(resetAt, now)).toBe(2);
  });
});
