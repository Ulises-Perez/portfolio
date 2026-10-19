import type { MetadataRoute } from "next";

import { site } from "@/data/site.config";

export const dynamic = "force-static";

/**
 * The site is served from the repository sub-path, so the sitemap URL carries
 * the same prefix the pages live under.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${site.domain}/${site.repo}/sitemap.xml`,
  };
}
