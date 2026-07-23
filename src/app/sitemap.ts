import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { env } from "@/lib/env";
import { getCityIdBySlug, getPublishedGatherings } from "@/lib/queries/gatherings";

/**
 * Extend this alongside each new page as it ships — see
 * /somacord-docs/docs/website/sitemap.md for the full approved site
 * structure this will eventually cover. Intentionally excluded: the
 * authenticated member experience (/home, /onboarding, /profile,
 * /gatherings/create, /gatherings/manage, /gatherings/[slug]/edit) and
 * auth utility pages (/auth/callback, /forgot-password, /reset-password)
 * — see robots.ts for the matching disallow rules.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${siteConfig.url}/cities/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let gatheringRoutes: MetadataRoute.Sitemap = [];
  if (env.supabase.isConfigured) {
    const cityId = await getCityIdBySlug(siteConfig.launchCity.slug);
    const gatherings = cityId ? await getPublishedGatherings(cityId) : [];
    gatheringRoutes = gatherings.map((gathering) => ({
      url: `${siteConfig.url}${gathering.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  }

  return [...staticRoutes, ...cityRoutes, ...gatheringRoutes];
}
