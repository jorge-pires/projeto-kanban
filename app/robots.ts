import type { MetadataRoute } from "next";

const siteUrl = "https://projeto-kanban-pi.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register"],
      disallow: ["/api/", "/dashboard", "/profile", "/projects", "/tasks", "/calendar"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
