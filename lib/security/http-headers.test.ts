import { describe, expect, it } from "vitest";

import {
  contentSecurityPolicy,
  securityHeaders,
} from "@/lib/security/http-headers";

describe("security headers", () => {
  it("prevents the application from being framed", () => {
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
    expect(securityHeaders).toContainEqual({
      key: "X-Frame-Options",
      value: "DENY",
    });
  });

  it("disables unnecessary browser capabilities", () => {
    const permissionsPolicy = securityHeaders.find(
      (header) => header.key === "Permissions-Policy",
    );

    expect(permissionsPolicy?.value).toContain("camera=()");
    expect(permissionsPolicy?.value).toContain("microphone=()");
  });
});
