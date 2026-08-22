import { z } from "zod";

export const serverEnvironmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required.")
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "postgresql:" || url.protocol === "postgres:";
      } catch {
        return false;
      }
    }, "DATABASE_URL must be a valid PostgreSQL connection string."),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must contain at least 32 characters."),
});

export function parseServerEnvironment(
  environment: Record<string, string | undefined>,
) {
  const result = serverEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid server environment:\n${details}`);
  }

  return result.data;
}
