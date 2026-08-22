import type { NextConfig } from "next"

import { securityHeaders } from "./lib/security/http-headers"

const nextConfig: NextConfig = {
  poweredByHeader: false,

  allowedDevOrigins: [
    "192.168.1.4",
    "192.168.1.4:3000",
  ],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders],
      },
    ]
  },
}

export default nextConfig
