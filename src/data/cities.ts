import { photography } from "@/config/media";
import type { CityLaunchStatus } from "@/types/domain";

/**
 * City content for `/cities/[city]`.
 *
 * Sitemap/SEO note: this route pattern is built to support additional
 * cities without code changes (see docs/website/sitemap.md and
 * docs/website/seo-strategy.md) — add a new entry here when a city
 * launches instead of hardcoding a new page.
 *
 * Salt Lake City is the only launch city (docs/business/launch-strategy.md).
 * Its `launchStatus` is still "example" because no real gatherings or
 * members exist yet — every category/gathering shown here is labeled
 * "Example" until that changes.
 */
export interface CityActivityCategory {
  title: string;
  description: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
}

export interface CityContent {
  slug: string;
  name: string;
  state: string;
  launchStatus: CityLaunchStatus;
  heroImage: { src: string; alt: string };
  heroDescription: string;
  activityCategories: CityActivityCategory[];
}

export const cities: CityContent[] = [
  {
    slug: "salt-lake-city",
    name: "Salt Lake City",
    state: "UT",
    launchStatus: "example",
    heroImage: photography.saltLakeCityBanner,
    heroDescription:
      "From coffee meetups downtown to foothill hikes at sunset — see the kinds of places Somacord gathers in SLC.",
    activityCategories: [
      {
        title: "Coffee meetups",
        description: "Casual, recurring, easy to walk into.",
        tag: "Coffee",
        imageSrc: photography.coffeeGathering.src,
        imageAlt: photography.coffeeGathering.alt,
      },
      {
        title: "Foothill hikes",
        description: "Wasatch trails, easy pace, big conversation.",
        tag: "Outdoors",
        imageSrc: photography.hikingGathering.src,
        imageAlt: photography.hikingGathering.alt,
      },
      {
        title: "Community dinners",
        description: "Shared plates with local partner restaurants.",
        tag: "Dinner",
        imageSrc: photography.dinnerGathering.src,
        imageAlt: photography.dinnerGathering.alt,
      },
    ],
  },
];

export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug);
}
