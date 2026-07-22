import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface HeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** "lg" (homepage, 640px) or "md" (secondary pages, 420px). */
  size?: "lg" | "md";
  className?: string;
}

/**
 * Full-bleed photography hero with a Deep Cord Blue gradient overlay.
 * Reused across Home, Community Partners, and City pages per
 * docs/design/photography-direction.md ("reuse a small, curated
 * photography library ... instead of a different hero image per page").
 */
export function Hero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  actions,
  size = "lg",
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "bg-cord-blue relative flex items-center overflow-hidden px-5 sm:px-10",
        size === "lg" ? "min-h-[480px] sm:min-h-[640px]" : "min-h-[360px] sm:min-h-[420px]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,78,95,0.55)] to-[rgba(31,78,95,0.85)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-xl py-16 text-center text-white">
        {eyebrow}
        <h1
          className={cn(
            "font-display mb-5",
            size === "lg" ? "text-[38px] sm:text-[58px]" : "text-[32px] sm:text-[42px]",
          )}
        >
          {title}
        </h1>
        {description && <p className="mb-8 text-lg opacity-90">{description}</p>}
        {actions && <div className="flex flex-wrap justify-center gap-4">{actions}</div>}
      </div>
    </section>
  );
}
