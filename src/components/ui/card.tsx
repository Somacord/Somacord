import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card — docs/design/design-system.md ("Cards")
 * 16px border radius, 1px Soft Sky border, white background.
 * Hover: lift 3px + soft shadow.
 */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border-soft-sky overflow-hidden border bg-white transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(31,78,95,0.14)]",
        className,
      )}
      {...props}
    />
  );
}

/** Fixed-height image slot at the top of a Card, with room for an overlaid CategoryTag. */
export function CardImage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative h-[190px]", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-[18px] pb-[22px]", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("mb-1.5 text-[19px]", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-ink-muted mb-3 text-sm", className)} {...props} />;
}

/** Column of small meta rows (location, date/time, group size). */
export function CardMeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-ink-muted mb-3.5 flex flex-col gap-1 text-[13px]", className)}
      {...props}
    />
  );
}
