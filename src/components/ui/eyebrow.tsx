import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Small uppercase label used above section headings, hero copy, and the
 * pricing card ("eyebrow" in the approved mockup).
 */
export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-community-green mb-3 text-[13px] font-semibold tracking-[0.08em] uppercase",
        className,
      )}
      {...props}
    />
  );
}
