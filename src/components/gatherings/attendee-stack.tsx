import * as React from "react";

import { Avatar } from "@/components/ui/avatar";

export interface AttendeeStackProps {
  imageSrc: string;
  count?: number;
}

/**
 * "Who's going" avatar stack — docs/design/website-mockups.md (Gathering
 * Detail). The approved photography library currently has a single
 * member-portrait placeholder, so it's reused with a fading opacity per
 * avatar, exactly as the approved mockup does; this is a UI pattern, not
 * a claim about a specific number of real attendees.
 */
export function AttendeeStack({ imageSrc, count = 3 }: AttendeeStackProps) {
  return (
    <div className="flex gap-2.5">
      {Array.from({ length: count }).map((_, index) => (
        <Avatar
          key={index}
          src={imageSrc}
          alt="Member"
          opacity={index === 0 ? undefined : 1 - index * 0.25}
        />
      ))}
    </div>
  );
}
