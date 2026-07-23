import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/style-guide",
        "/home",
        "/onboarding",
        "/profile",
        "/auth",
        "/reset-password",
        "/gatherings/create",
        "/gatherings/manage",
        "/gatherings/*/edit",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
