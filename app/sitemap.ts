import type { MetadataRoute } from "next";
import { DATA_LAST_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
