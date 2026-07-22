import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckListProps {
  items: readonly string[];
  className?: string;
}

/** Benefit list with a green checkmark bullet — used on membership/pricing content. */
export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={cn("mb-2 list-none", className)}>
      {items.map((item) => (
        <li key={item} className="relative mb-2.5 pl-[26px] text-[15px]">
          <span className="text-community-green absolute left-0 font-bold">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
