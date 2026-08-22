import type { MetadataRoute } from "next";

const siteUrl = "https://projeto-kanban-pi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
