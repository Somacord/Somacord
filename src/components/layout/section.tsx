import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Section — the vertical-rhythm wrapper used for every marketing-site
 * block (`section { padding: 88px 40px }` in the approved mockup), with
 * the four background tones defined there: default, sky, sand, dark.
 */
const sectionVariants = cva("px-5 py-14 sm:px-10 sm:py-[88px]", {
  variants: {
    tone: {
      default: "bg-white text-ink",
      sky: "bg-soft-sky text-ink",
      sand: "bg-warm-sand text-sand-ink",
      dark: "bg-cord-blue text-white",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {}

export function Section({ className, tone, ...props }: SectionProps) {
  return <section className={cn(sectionVariants({ tone, className }))} {...props} />;
}
