import { gatherings, getGatheringBySlug } from "@/data/gatherings";

/**
 * Placeholder data for the Member Dashboard (/home) — per this
 * milestone's brief: "Use placeholder data where necessary. Do not
 * build backend event logic yet." Gatherings shown here reuse the same
 * approved mock dataset as the public site (still example content, still
 * labeled as such); Speed Connect and Community Updates are clearly
 * illustrative placeholders, not real scheduled events or announcements.
 */

export function getUpcomingGatherings() {
  const slugs = ["saturday-coffee-meetup", "foothills-sunset-hike"];
  return slugs
    .map((slug) => getGatheringBySlug(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
}

export function getRecommendedGatherings() {
  return gatherings.filter((g) => !g.external).slice(3, 6);
}

export function getMyRsvps() {
  const slugs = ["board-game-night"];
  return slugs
    .map((slug) => getGatheringBySlug(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
}

export interface PlaceholderSpeedConnectSession {
  scheduledFor: string;
  format: string;
}

export function getUpcomingSpeedConnect(): PlaceholderSpeedConnectSession | null {
  return { scheduledFor: "This Thursday, 6:00 PM", format: "Virtual — 4 people" };
}

export interface CommunityUpdate {
  title: string;
  description: string;
}

export const communityUpdates: CommunityUpdate[] = [
  {
    title: "Somacord is live in Salt Lake City",
    description:
      "You're part of the founding community — gatherings and Community Partners are just getting started.",
  },
  {
    title: "New Community Partners are joining",
    description: "Local coffee shops, restaurants, and clubs are signing up to host gatherings.",
  },
  {
    title: "More gatherings added every week",
    description: "Check back often — new community and partner gatherings are added regularly.",
  },
];
