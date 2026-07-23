import * as React from "react";

import { cn } from "@/lib/utils";

/** Generic bordered white panel — used to frame standalone forms (Sign In, Join). */
export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border-soft-sky border bg-white p-8 shadow-[0_20px_50px_rgba(31,78,95,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
