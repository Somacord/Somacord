/**
 * Placeholder data for the Member Dashboard (/home) that's still out of
 * scope for this pass — Speed Connect booking and Community Updates.
 * Gatherings/RSVPs on the dashboard are real, fetched from Supabase via
 * src/lib/queries/gatherings.ts — see src/app/home/page.tsx.
 */

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
