import { describe, expect, it } from "vitest";

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
