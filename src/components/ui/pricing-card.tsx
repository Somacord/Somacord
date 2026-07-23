"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FilterPill } from "@/components/ui/filter-pill";
import type { MembershipPricingPlan } from "@/config/site";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  eyebrow: string;
  plans: readonly MembershipPricingPlan[];
  benefits: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  footnote?: React.ReactNode;
  className?: string;
}

/**
 * Pricing card — used on the Membership page for the Somacord Membership.
 * One membership, three billing plans (monthly / quarterly / yearly) with
 * a shared benefits list, since every plan includes the same benefits.
 */
export function PricingCard({
  eyebrow,
  plans,
  benefits,
  ctaLabel,
  ctaHref,
  footnote,
  className,
}: PricingCardProps) {
  const [selectedId, setSelectedId] = React.useState(plans[0]?.id);
  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0];

  return (
    <div
      className={cn(
        "rounded-card-lg border-soft-sky mx-auto max-w-[440px] border bg-white px-9 py-10 text-center shadow-[0_20px_50px_rgba(31,78,95,0.10)]",
        className,
      )}
    >
      <Eyebrow className="mb-0">{eyebrow}</Eyebrow>

      <div className="my-5 flex justify-center gap-2">
        {plans.map((plan) => (
          <FilterPill
            key={plan.id}
            active={plan.id === selectedPlan?.id}
            onClick={() => setSelectedId(plan.id)}
          >
            {plan.label}
          </FilterPill>
        ))}
      </div>

      {selectedPlan && (
        <div className="font-display text-cord-blue mb-2 text-5xl font-bold">
          ${selectedPlan.price}
          <span className="text-ink-muted text-base font-medium">/{selectedPlan.interval}</span>
        </div>
      )}

      <CheckList items={benefits} className="mt-6 text-left" />
      <Button asChild variant="primary" className="w-full">
        <a href={ctaHref}>{ctaLabel}</a>
      </Button>
      {footnote && <p className="text-ink-muted mt-4 text-xs">{footnote}</p>}
    </div>
  );
}
