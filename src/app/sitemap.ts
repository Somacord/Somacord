import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { gatherings } from "@/data/gatherings";

/**
 * Extend this alongside each new page as it ships — see
 * /somacord-docs/docs/website/sitemap.md for the full approved site
 * structure this will eventually cover (the member account flow is not
 * part of the public marketing site built so far).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/gatherings",
    "/membership",
    "/partners",
    "/speed-connect",
    "/about",
    "/contact",
    "/signin",
    "/signup",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const gatheringRoutes: MetadataRoute.Sitemap = gatherings
    .filter((gathering) => !gathering.external)
    .map((gathering) => ({
      url: `${siteConfig.url}/gatherings/${gathering.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteConfig.url}/cities/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes, ...gatheringRoutes];
}
