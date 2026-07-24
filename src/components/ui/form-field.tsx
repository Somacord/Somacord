import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  /** Override the label color — for forms placed on a dark Section background. */
  labelClassName?: string;
  /** Override the hint text color — for forms placed on a dark Section background. */
  hintClassName?: string;
  children: React.ReactNode;
}

/** Pairs a Label with its control and an optional hint line — used by every form on the site. */
export function FormField({
  label,
  htmlFor,
  hint,
  className,
  labelClassName,
  hintClassName,
  children,
}: FormFieldProps) {
  return (
    <div className={cn(className)}>
      <Label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </Label>
      {children}
      {hint && <p className={cn("text-ink-muted mt-1.5 text-xs", hintClassName)}>{hint}</p>}
    </div>
  );
}
