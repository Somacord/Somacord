import * as React from "react";

import { cn } from "@/lib/utils";

export interface PartnerTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/** Small card used in the Community Partners "Partner Types" grid. */
export function PartnerTypeCard({ icon, title, description, className }: PartnerTypeCardProps) {
  return (
    <div className={cn("rounded-card-sm border-soft-sky border bg-white p-[22px]", className)}>
      <h4 className="mb-1.5 flex items-center gap-2 text-base">
        <span aria-hidden>{icon}</span>
        {title}
      </h4>
      <p className="text-ink-muted text-[13px]">{description}</p>
    </div>
  );
}
