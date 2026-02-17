import { NAVIGATION_CONFIG } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...NAVIGATION_CONFIG.ROBOTS_DISALLOW],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
