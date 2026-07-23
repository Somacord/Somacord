import * as React from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Shown when a filtered/searched list has no results. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border-soft-sky flex flex-col items-center border border-dashed bg-white px-6 py-16 text-center",
        className,
      )}
    >
      <h3 className="mb-2 text-xl">{title}</h3>
      {description && <p className="text-ink-muted mb-6 max-w-sm text-sm">{description}</p>}
      {action}
    </div>
  );
}
