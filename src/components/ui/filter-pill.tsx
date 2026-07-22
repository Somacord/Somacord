import * as React from "react";

import { cn } from "@/lib/utils";

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Category filter pill — used above the Gatherings discovery grid. */
export const FilterPill = React.forwardRef<HTMLButtonElement, FilterPillProps>(
  ({ active, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "rounded-pill border-soft-sky text-cord-blue border-[1.5px] px-[18px] py-2 text-[13px] font-semibold transition-colors",
        active && "border-cord-blue bg-cord-blue text-white",
        className,
      )}
      {...props}
    />
  ),
);
FilterPill.displayName = "FilterPill";
