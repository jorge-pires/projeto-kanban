import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("normalizes email without rejecting an existing short password", () => {
    const result = loginSchema.safeParse({
      email: "  JORGE@example.com ",
      password: "legacy12",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("jorge@example.com");
    }
  });
});

describe("registerSchema", () => {
  it("requires at least ten password characters for new accounts", () => {
    const result = registerSchema.safeParse({
      name: "Jorge Pires",
      email: "jorge@example.com",
      password: "short123",
      passwordConfirmation: "short123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a different password confirmation", () => {
    const result = registerSchema.safeParse({
      name: "Jorge Pires",
      email: "jorge@example.com",
      password: "secure-password",
      passwordConfirmation: "another-password",
    });

    expect(result.success).toBe(false);
  });

  it("accepts and normalizes valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "  Jorge Pires  ",
      email: "  JORGE@example.com ",
      password: "secure-password",
      passwordConfirmation: "secure-password",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Jorge Pires");
      expect(result.data.email).toBe("jorge@example.com");
    }
  });
});
