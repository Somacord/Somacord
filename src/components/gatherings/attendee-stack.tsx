export interface AttendeeStackProps {
  count: number;
}

/**
 * "Who's going" count — aggregate only (from `gathering_rsvp_counts`), so
 * this never exposes individual attendee identity. Real count, never a
 * fabricated one — see docs/product/vision.md's "Examples over invention".
 */
export function AttendeeStack({ count }: AttendeeStackProps) {
  if (count === 0) {
    return <p className="text-ink-muted text-sm">Be the first to RSVP.</p>;
  }

  return (
    <p className="text-ink text-sm font-medium">
      {count} {count === 1 ? "person" : "people"} going
    </p>
  );
}
