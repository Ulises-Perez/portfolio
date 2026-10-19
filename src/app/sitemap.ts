import type { MetadataRoute } from "next";

import { site } from "@/data/site.config";
import { generatedAt } from "@/lib/github";

export const dynamic = "force-static";

/**
 * Single page site: one entry, refreshed with every snapshot commit.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${site.domain}/${site.repo}/`,
      lastModified: new Date(generatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
