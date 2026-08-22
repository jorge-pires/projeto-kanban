import { describe, expect, it } from "vitest";

import { parseServerEnvironment } from "@/lib/env";

const validEnvironment = {
  DATABASE_URL: "postgresql://taskflow:secret@localhost:5432/taskflow",
  AUTH_SECRET: "a-secure-test-secret-with-32-characters",
};

describe("parseServerEnvironment", () => {
  it("returns validated server variables", () => {
    expect(parseServerEnvironment(validEnvironment)).toEqual(validEnvironment);
  });

  it("rejects a non-PostgreSQL database URL", () => {
    expect(() =>
      parseServerEnvironment({
        ...validEnvironment,
        DATABASE_URL: "file:./dev.db",
      }),
    ).toThrow("DATABASE_URL must be a valid PostgreSQL connection string");
  });

  it("rejects a short authentication secret", () => {
    expect(() =>
      parseServerEnvironment({
        ...validEnvironment,
        AUTH_SECRET: "too-short",
      }),
    ).toThrow("AUTH_SECRET must contain at least 32 characters");
  });
});
