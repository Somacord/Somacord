import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "border-soft-sky text-ink placeholder:text-ink-muted focus:border-cord-blue focus:ring-cord-blue/20 w-full resize-none rounded-[10px] border bg-white px-4 py-2.5 text-base focus:ring-2 focus:outline-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
