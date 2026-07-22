import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  /** Used for the stacked "who's going" fade effect on gathering detail pages. */
  opacity?: number;
}

/** Circular avatar — docs/design/design-system.md ("Profile Components") */
export function Avatar({ src, alt, size = 64, className, opacity }: AvatarProps) {
  return (
    <div
      className={cn("rounded-pill relative shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size, opacity }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} />
    </div>
  );
}
