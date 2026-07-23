import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cancelRsvpAction, rsvpGoingAction } from "@/lib/actions/rsvps";

export interface RsvpButtonProps {
  gatheringId: string;
  slug: string;
  isGoing: boolean;
  isSignedIn: boolean;
  /** True once the gathering's start time has passed — RSVPing is no longer actionable. */
  isPast: boolean;
  className?: string;
}

/** RSVP toggle for a gathering detail page, backed by the `rsvps` table. */
export function RsvpButton({
  gatheringId,
  slug,
  isGoing,
  isSignedIn,
  isPast,
  className,
}: RsvpButtonProps) {
  if (isPast) {
    return (
      <div className={className}>
        <p className="text-ink-muted text-sm">This gathering already took place.</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className={className}>
        <Button asChild variant="primary">
          <Link href={`/signup?next=/gatherings/${slug}`}>Sign Up to RSVP</Link>
        </Button>
        <p className="text-ink-muted mt-2 text-xs">
          Already have an account?{" "}
          <Link
            href={`/signin?next=/gatherings/${slug}`}
            className="text-cord-blue font-medium underline"
          >
            Sign in
          </Link>
        </p>
      </div>
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
