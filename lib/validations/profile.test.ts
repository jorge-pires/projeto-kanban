import { describe, expect, it } from "vitest";

import { profileSchema } from "@/lib/validations/profile";

describe("profileSchema", () => {
  it("accepts valid profile information", () => {
    const result = profileSchema.safeParse({
      name: "Jorge Pires",
      email: "jorge@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("normalizes the name and email", () => {
    const result = profileSchema.safeParse({
      name: "  Jorge Pires  ",
      email: "  JORGE@EXAMPLE.COM  ",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data).toEqual({
      name: "Jorge Pires",
      email: "jorge@example.com",
    });
  });

  it("rejects a name shorter than two characters", () => {
    const result = profileSchema.safeParse({
      name: "J",
      email: "jorge@example.com",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.name).toContain(
      "O nome deve ter pelo menos 2 caracteres.",
    );
  });

  it("rejects an invalid email address", () => {
    const result = profileSchema.safeParse({
      name: "Jorge Pires",
      email: "email-invalido",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.email).toContain(
      "Digite um endereço de e-mail válido.",
    );
  });
});
