import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cancelRsvpAction, rsvpGoingAction } from "@/lib/actions/rsvps";

export interface RsvpButtonProps {
  gatheringId: string;
  slug: string;
  isGoing: boolean;
  isSignedIn: boolean;
  className?: string;
}

/** RSVP toggle for a gathering detail page, backed by the `rsvps` table. */
export function RsvpButton({ gatheringId, slug, isGoing, isSignedIn, className }: RsvpButtonProps) {
  if (!isSignedIn) {
    return (
      <Button asChild variant="primary" className={className}>
        <Link href={`/signin?next=/gatherings/${slug}`}>Sign In to RSVP</Link>
      </Button>
    );
  }

  if (isGoing) {
    return (
      <form action={cancelRsvpAction.bind(null, gatheringId, slug)}>
        <Button type="submit" variant="secondary-light" className={className}>
          You&apos;re Going ✓ — Cancel
        </Button>
      </form>
    );
  }

  return (
    <form action={rsvpGoingAction.bind(null, gatheringId, slug)}>
      <Button type="submit" variant="primary" className={className}>
        Join This Gathering
      </Button>
    </form>
  );
}
