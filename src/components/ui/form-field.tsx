import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Pairs a Label with its control and an optional hint line — used by every form on the site. */
export function FormField({ label, htmlFor, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn(className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-ink-muted mt-1.5 text-xs">{hint}</p>}
    </div>
  );
}
