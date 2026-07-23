import * as React from "react";

import { cn } from "@/lib/utils";

/** Text input — shares the soft-sky border language used by cards and filter pills. */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "border-soft-sky text-ink placeholder:text-ink-muted focus:border-cord-blue focus:ring-cord-blue/20 disabled:bg-soft-sky/40 disabled:text-ink-muted w-full rounded-[10px] border bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
