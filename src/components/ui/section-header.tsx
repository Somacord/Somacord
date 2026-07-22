import * as React from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subhead?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * Section header — eyebrow + heading (+ optional subhead / trailing
 * action link), used at the top of nearly every marketing-site section.
 */
export function SectionHeader({
  eyebrow,
  title,
  subhead,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={align === "center" ? "max-w-xl" : undefined}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-[28px] sm:text-[34px]">{title}</h2>
        {subhead && <p className="text-ink-muted mt-2 max-w-[480px] text-base">{subhead}</p>}
      </div>
      {action}
    </div>
  );
}
