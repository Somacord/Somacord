"use client";

import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * RSVP toggle for a gathering detail page. This is local UI state only —
 * there is no backend/RSVP persistence yet (see docs/engineering/database-schema.md
 * `rsvps` table for the eventual shape). Wire this up to Supabase in a
 * follow-up feature pass.
 */
export function RsvpButton({ className, ...props }: Omit<ButtonProps, "children" | "onClick">) {
  const [isGoing, setIsGoing] = React.useState(false);

  return (
    <Button
      type="button"
      variant={isGoing ? "secondary-light" : "primary"}
      onClick={() => setIsGoing((going) => !going)}
      className={className}
      {...props}
    >
      {isGoing ? "You're Going ✓" : "Join This Gathering"}
    </Button>
  );
}
