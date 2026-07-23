import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * "Example" content label.
 *
 * Until real gatherings/members exist in a city, any placeholder content
 * must be clearly labeled "Example" and never imply an active community
 * that doesn't exist yet. See /somacord-docs/docs/product/mvp-requirements.md.
 *
 * Every component that renders sample data (GatheringCard, PricingCard's
 * "example month", etc.) should compose this rather than a bare string,
 * so the labeling can never be silently dropped by a feature page.
 */
export function ExampleTag({
  className,
  children = "Example",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "rounded-pill bg-warm-sand text-charcoal mb-2 inline-block px-[9px] py-[3px] text-[11px] font-semibold tracking-[0.06em] uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export type GatheringCategoryLabel = "Community" | "Partner" | "Start here";

/**
 * Small pill overlaid top-left on a card image, labeling the gathering
 * category ("Community" / "Partner" / "Start here").
 */
export function CategoryTag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "rounded-pill text-cord-blue absolute top-3 left-3 bg-white px-3 py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Rounded tag for profile interests/activities. Never swipeable, never
 * ranked — see docs/design/design-system.md ("Profile Components").
 */
export function PillTag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "rounded-pill bg-soft-sky text-cord-blue mr-1.5 mb-1.5 inline-block px-3 py-[5px] text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}
