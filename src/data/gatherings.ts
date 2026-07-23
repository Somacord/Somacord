import type { GatheringCategoryLabel } from "@/components/ui/badge";
import { photography } from "@/config/media";

/**
 * Mock gathering listings for the MVP public website.
 *
 * Launch Honesty Rule: Salt Lake City has no live gatherings yet, so
 * every entry here is explicitly an "Example" (see GatheringCard /
 * gathering detail page — `isExample` defaults to true and is never
 * overridden). Content is drawn directly from the approved mockup
 * (`/assets/mockups/somacord-website-mockup.html`); longer detail-page
 * descriptions extend that same one-line copy in the same voice rather
 * than inventing new scenarios, and never claim a specific number of
 * real attendees.
 */
export interface MockGathering {
  slug: string;
  title: string;
  category: GatheringCategoryLabel;
  shortDescription: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  location: string;
  schedule: string;
  groupSize: string;
  hostedBy: string;
  /** Cards for this entry link straight to /speed-connect instead of a detail page. */
  external?: true;
}

export const gatherings: MockGathering[] = [
  {
    slug: "free-speed-connect",
    title: "Free Speed Connect",
    category: "Start here",
    shortDescription: "The easiest way to meet a few new people this week.",
    description:
      "Speed Connect is a short, guided conversation experience — just enough structure to make a first hello easy, then it gets out of the way. It's free, with no signup commitment required to try.",
    imageSrc: photography.coffeeGathering.src,
    imageAlt: photography.coffeeGathering.alt,
    location: "Virtual & in-person",
    schedule: "Daily slots",
    groupSize: "A few people per session",
    hostedBy: "Somacord",
    external: true,
  },
  {
    slug: "saturday-coffee-meetup",
    title: "Saturday Coffee Meetup",
    category: "Community",
    shortDescription: "A relaxed weekly meetup for regulars and newcomers alike.",
    description:
      "A relaxed, weekly coffee meetup for anyone looking to make a few new friends in the neighborhood. No agenda — just good coffee and easy conversation. New faces are always welcome, and regulars help keep it warm and low-pressure.",
    imageSrc: photography.coffeeGathering.src,
    imageAlt: photography.coffeeGathering.alt,
    location: "The Daily Bean, Salt Lake City",
    schedule: "Saturdays, 10:00 AM",
    groupSize: "4–8 people",
    hostedBy: "Community member",
  },
  {
    slug: "foothills-sunset-hike",
    title: "Foothills Sunset Hike",
    category: "Community",
    shortDescription: "An easy 3-mile trail with big views and easy conversation.",
    description:
      "An easy-paced 3-mile out-and-back along the foothills, timed for golden-hour views over the valley. No hiking experience required — the pace is set for conversation, not the summit.",
    imageSrc: photography.hikingGathering.src,
    imageAlt: photography.hikingGathering.alt,
    location: "Bonneville Shoreline Trail",
    schedule: "Thursdays, 6:30 PM",
    groupSize: "5–10 people",
    hostedBy: "Community member",
  },
  {
    slug: "board-game-night",
    title: "Board Game Night",
    category: "Community",
    shortDescription: "Low-pressure games, snacks, and new faces every week.",
    description:
      "A standing weekly game night with a rotating mix of easy-to-learn board games. Come solo or bring a friend — there's always a seat and someone to explain the rules.",
    imageSrc: photography.gameNight.src,
    imageAlt: photography.gameNight.alt,
    location: "Member host home",
    schedule: "Wednesdays, 7:00 PM",
    groupSize: "6–10 people",
    hostedBy: "Community member",
  },
  {
    slug: "downtown-lunch-walk",
    title: "Downtown Lunch Walk",
    category: "Community",
    shortDescription: "A midday walk and conversation loop through downtown.",
    description:
      "A short, easy walking loop through downtown over the lunch hour — a low-commitment way to get outside, move a little, and talk to someone new before heading back to work.",
    imageSrc: photography.walkingTogether.src,
    imageAlt: photography.walkingTogether.alt,
    location: "City Creek area",
    schedule: "Tuesdays, 12:00 PM",
    groupSize: "4–8 people",
    hostedBy: "Community member",
  },
  {
    slug: "community-dinner-gilded-fork",
    title: "Community Dinner at The Gilded Fork",
    category: "Partner",
    shortDescription: "A shared-plates dinner hosted by a local partner restaurant.",
    description:
      "A shared-plates community dinner hosted by The Gilded Fork on one of their quieter nights — long tables, family-style plates, and an easy way to meet the regulars.",
    imageSrc: photography.dinnerGathering.src,
    imageAlt: photography.dinnerGathering.alt,
    location: "The Gilded Fork",
    schedule: "Fridays, 7:00 PM",
    groupSize: "8–14 people",
    hostedBy: "Community Partner",
  },
  {
    slug: "morning-regulars-daily-bean",
    title: "Morning Regulars at The Daily Bean",
    category: "Partner",
    shortDescription: "A standing coffee gathering hosted by a partner coffee shop.",
    description:
      "A standing Monday-morning coffee gathering hosted by The Daily Bean for their regulars — and anyone on Somacord looking for an easy way into the neighborhood's coffee crowd.",
    imageSrc: photography.communityPartner.src,
    imageAlt: photography.communityPartner.alt,
    location: "The Daily Bean",
    schedule: "Mondays, 8:30 AM",
    groupSize: "4–8 people",
    hostedBy: "Community Partner",
  },
];

export function getGatheringHref(gathering: MockGathering) {
  return gathering.external ? "/speed-connect" : `/gatherings/${gathering.slug}`;
}

export function getGatheringBySlug(slug: string) {
  return gatherings.find((gathering) => gathering.slug === slug && !gathering.external);
}

export function getRelatedGatherings(slug: string, take = 3) {
  const current = getGatheringBySlug(slug);
  if (!current) return [];

  const sameCategory = gatherings.filter(
    (g) => g.slug !== slug && !g.external && g.category === current.category,
  );
  const rest = gatherings.filter(
    (g) => g.slug !== slug && !g.external && g.category !== current.category,
  );

  return [...sameCategory, ...rest].slice(0, take);
}

export function getFeaturedGatherings(take = 3) {
  return gatherings.filter((g) => !g.external).slice(0, take);
}
