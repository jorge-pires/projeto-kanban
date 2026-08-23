import { createHmac } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { getServerEnv } from "@/lib/env";

export type AuthRateLimitAction = "login" | "register";

interface ConsumeAuthRateLimitOptions {
  action: AuthRateLimitAction;
  identifier: string;
  maxAttempts: number;
  windowMs: number;
  userId?: string;
}

interface AuthRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function hashIdentifier(action: AuthRateLimitAction, identifier: string) {
  return createHmac("sha256", getServerEnv().AUTH_SECRET)
    .update(`${action}:${identifier}`)
    .digest("hex");
}

export async function consumeAuthRateLimit({
  action,
  identifier,
  maxAttempts,
  windowMs,
  userId,
}: ConsumeAuthRateLimitOptions): Promise<AuthRateLimitResult> {
  const identifierHash = hashIdentifier(action, identifier);
  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const existingAttempt = await transaction.authAttempt.findUnique({
      where: {
        action_identifierHash: {
          action,
          identifierHash,
        },
      },
      select: {
        id: true,
        attempts: true,
        resetAt: true,
      },
    });

    if (
      existingAttempt &&
      existingAttempt.resetAt > now &&
      existingAttempt.attempts >= maxAttempts
    ) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existingAttempt.resetAt.getTime() - now.getTime()) / 1000),
        ),
      };
    }

    const resetAt = new Date(now.getTime() + windowMs);

    if (!existingAttempt) {
      await transaction.authAttempt.create({
        data: {
          action,
          identifierHash,
          attempts: 1,
          resetAt,
          userId,
        },
      });
    } else if (existingAttempt.resetAt <= now) {
      await transaction.authAttempt.update({
        where: {
          id: existingAttempt.id,
        },
        data: {
          attempts: 1,
          resetAt,
          userId,
        },
      });
    } else {
      await transaction.authAttempt.update({
        where: {
          id: existingAttempt.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
          userId,
        },
      });
    }

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  });
}

export async function clearAuthRateLimit(
  action: AuthRateLimitAction,
  identifier: string,
) {
  await prisma.authAttempt.deleteMany({
    where: {
      action,
      identifierHash: hashIdentifier(action, identifier),
    },
  });
}
