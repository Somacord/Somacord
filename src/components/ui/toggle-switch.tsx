import * as React from "react";

import { cn } from "@/lib/utils";

export interface ToggleSwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
}

/** Accessible checkbox styled as a toggle switch — used for notification settings. */
export const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, description, className, id, ...props }, ref) => (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-3">
      <span>
        <span className="text-ink block text-sm font-medium">{label}</span>
        {description && <span className="text-ink-muted block text-xs">{description}</span>}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input ref={ref} id={id} type="checkbox" className="peer sr-only" {...props} />
        <span
          className={cn(
            "rounded-pill bg-soft-sky peer-checked:bg-community-green absolute inset-0 transition-colors",
            className,
          )}
        />
        <span className="rounded-pill absolute left-0.5 h-5 w-5 bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  ),
);
ToggleSwitch.displayName = "ToggleSwitch";
