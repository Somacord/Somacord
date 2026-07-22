import * as React from "react";

import { Button } from "@/components/ui/button";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  eyebrow: string;
  price: number;
  interval: string;
  benefits: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  footnote?: React.ReactNode;
  className?: string;
}

/**
 * Pricing card — used on the Membership page for the $39/month Founding
 * Membership. Generic/parameterized so it isn't tied to one specific
 * price point if business terms change.
 */
export function PricingCard({
  eyebrow,
  price,
  interval,
  benefits,
  ctaLabel,
  ctaHref,
  footnote,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "rounded-card-lg border-soft-sky mx-auto max-w-[420px] border bg-white px-9 py-10 text-center shadow-[0_20px_50px_rgba(31,78,95,0.10)]",
        className,
      )}
    >
      <Eyebrow className="mb-0">{eyebrow}</Eyebrow>
      <div className="font-display text-cord-blue my-2 text-5xl font-bold">
        ${price}
        <span className="text-ink-muted text-base font-medium">/{interval}</span>
      </div>
      <CheckList items={benefits} className="mt-6 text-left" />
      <Button asChild variant="primary" className="w-full">
        <a href={ctaHref}>{ctaLabel}</a>
      </Button>
      {footnote && <p className="text-ink-muted mt-4 text-xs">{footnote}</p>}
    </div>
  );
}
