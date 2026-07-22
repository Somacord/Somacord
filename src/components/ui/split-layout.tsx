import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SplitLayoutProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
  /** Puts the image on the right on desktop instead of the left. */
  reverse?: boolean;
  className?: string;
}

/**
 * Two-column media + content layout — used for the homepage membership
 * preview / partners teaser sections and the About page.
 */
export function SplitLayout({
  imageSrc,
  imageAlt,
  children,
  reverse = false,
  className,
}: SplitLayoutProps) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-14", className)}>
      <div
        className={cn(
          "rounded-card-lg relative h-[280px] overflow-hidden sm:h-[420px]",
          reverse && "lg:order-2",
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
