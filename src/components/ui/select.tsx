import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "border-soft-sky text-ink focus:border-cord-blue focus:ring-cord-blue/20 w-full rounded-[10px] border bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";

export { Select };
