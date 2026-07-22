import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Constrains content to the approved 1180px max width used throughout
 * the marketing site mockups ("section-inner" in the approved prototype).
 */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-page", className)} {...props} />;
}
