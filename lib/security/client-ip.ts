interface HeadersReader {
  get(name: string): string | null;
}

export function getClientIp(headers: HeadersReader): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const candidate =
    headers.get("x-real-ip") ?? forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  return candidate.slice(0, 64);
}
