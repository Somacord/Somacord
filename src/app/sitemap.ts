import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Lists only routes that exist today. Extend this alongside each new
 * page as it ships — see /somacord-docs/docs/website/sitemap.md for the
 * full approved site structure this will eventually cover.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
