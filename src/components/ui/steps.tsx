import * as React from "react";

import { cn } from "@/lib/utils";

export interface Step {
  number: React.ReactNode;
  title: string;
  description: string;
}

export interface StepsProps {
  steps: Step[];
  className?: string;
}

/**
 * Numbered step grid — used on the homepage ("How It Works") and the
 * Speed Connect page ("What to expect" / "Why it's low pressure" / "What
 * happens after").
 */
export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn("mt-2 grid gap-8 sm:grid-cols-3", className)}>
      {steps.map((step, index) => (
        <div key={index}>
          <div className="rounded-pill bg-community-green font-display mb-4 flex h-11 w-11 items-center justify-center font-semibold text-white">
            {step.number}
          </div>
          <h3 className="mb-2 text-xl">{step.title}</h3>
          <p className="text-ink-muted text-sm">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
