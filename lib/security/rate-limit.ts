import { Prisma } from "@/generated/prisma/client";
import { parseServerEnvironment } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  createRateLimitKey,
  getRetryAfterSeconds,
} from "@/lib/security/rate-limit-helpers";

export { getClientAddress } from "@/lib/security/rate-limit-helpers";

interface RateLimitOptions {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const MAX_TRANSACTION_ATTEMPTS = 3;

export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const environment = parseServerEnvironment(process.env);
  const key = createRateLimitKey(scope, identifier, environment.AUTH_SECRET);

  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const now = new Date();
          const existingEntry = await transaction.rateLimitEntry.findUnique({
            where: { key },
          });

          if (!existingEntry || existingEntry.resetAt <= now) {
            await transaction.rateLimitEntry.upsert({
              where: { key },
              create: {
                key,
                attempts: 1,
                resetAt: new Date(now.getTime() + windowMs),
              },
              update: {
                attempts: 1,
                resetAt: new Date(now.getTime() + windowMs),
              },
            });

            return { allowed: true, retryAfterSeconds: 0 };
          }

          if (existingEntry.attempts >= limit) {
            return {
              allowed: false,
              retryAfterSeconds: getRetryAfterSeconds(existingEntry.resetAt, now),
            };
          }

          await transaction.rateLimitEntry.update({
            where: { key },
            data: {
              attempts: { increment: 1 },
            },
          });

          return { allowed: true, retryAfterSeconds: 0 };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      const canRetry =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < MAX_TRANSACTION_ATTEMPTS;

      if (!canRetry) {
        throw error;
      }
    }
  }

  return { allowed: false, retryAfterSeconds: 60 };
}

export async function clearRateLimit(scope: string, identifier: string) {
  const environment = parseServerEnvironment(process.env);
  const key = createRateLimitKey(scope, identifier, environment.AUTH_SECRET);

  await prisma.rateLimitEntry.deleteMany({
    where: { key },
  });
}
