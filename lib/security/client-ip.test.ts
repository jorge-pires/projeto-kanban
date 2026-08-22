import { describe, expect, it } from "vitest";

import { getClientIp } from "@/lib/security/client-ip";

describe("getClientIp", () => {
  it("prefers the platform real-IP header", () => {
    const headers = new Headers({
      "x-real-ip": "203.0.113.10",
      "x-forwarded-for": "198.51.100.20, 198.51.100.21",
    });

    expect(getClientIp(headers)).toBe("203.0.113.10");
  });

  it("uses only the first forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.20, 198.51.100.21",
    });

    expect(getClientIp(headers)).toBe("198.51.100.20");
  });

  it("uses a stable fallback when no address is available", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
