import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://snapcut.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "",          priority: 1,   freq: "weekly"  as const },
    { path: "/features", priority: 0.9, freq: "monthly" as const },
    { path: "/pricing",  priority: 0.9, freq: "monthly" as const },
    { path: "/about",    priority: 0.7, freq: "monthly" as const },
    { path: "/contact",  priority: 0.6, freq: "monthly" as const },
    { path: "/blog",     priority: 0.8, freq: "weekly"  as const },
    { path: "/privacy",  priority: 0.3, freq: "yearly"  as const },
    { path: "/terms",    priority: 0.3, freq: "yearly"  as const },
  ];

  const toolRoutes = [
    "/tools/background-remover",
    "/tools/white-background",
    "/tools/passport-photo",
    "/tools/linkedin-photo",
    "/tools/instagram-dp",
  ];

  return [
    ...staticRoutes.map(({ path, priority, freq }) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    })),
    ...toolRoutes.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
