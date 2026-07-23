import * as React from "react";

import { cn } from "@/lib/utils";

export interface FaqItemData {
  question: string;
  answer: React.ReactNode;
}

export interface FaqProps {
  items: FaqItemData[];
  className?: string;
}

/**
 * Accordion built on native `<details>`/`<summary>` — no client JS needed,
 * fully keyboard- and screen-reader-accessible out of the box. Used
 * anywhere the site needs a Q&A block (Homepage, Membership).
 */
export function Faq({ items, className }: FaqProps) {
  return (
    <div
      className={cn(
        "divide-soft-sky rounded-card border-soft-sky divide-y border bg-white",
        className,
      )}
    >
      {items.map((item) => (
        <details
          key={item.question}
          className="group first:rounded-t-card last:rounded-b-card px-6 py-5"
        >
          <summary className="text-ink flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none">
            {item.question}
            <span
              aria-hidden
              className="rounded-pill bg-soft-sky text-cord-blue flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-ink-muted mt-3 text-sm leading-relaxed">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
