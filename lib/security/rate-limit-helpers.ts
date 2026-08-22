import { createHmac } from "node:crypto";

export function getClientAddress(headers: Headers) {
  const forwardedAddress = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedAddress || headers.get("x-real-ip")?.trim() || "unknown";
}

export function createRateLimitKey(
  scope: string,
  identifier: string,
  secret: string,
) {
  return createHmac("sha256", secret)
    .update(`${scope}:${identifier.trim().toLocaleLowerCase("en-US")}`)
    .digest("hex");
}

export function getRetryAfterSeconds(resetAt: Date, now = new Date()) {
  return Math.max(1, Math.ceil((resetAt.getTime() - now.getTime()) / 1_000));
}
