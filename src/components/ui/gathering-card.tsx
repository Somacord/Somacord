import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { CategoryTag, ExampleTag } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardDescription,
  CardImage,
  CardMeta,
  CardTitle,
} from "@/components/ui/card";
import type { GatheringCategoryLabel } from "@/components/ui/badge";

export interface GatheringCardProps {
  title: string;
  description: string;
  category: GatheringCategoryLabel;
  imageSrc: string;
  imageAlt: string;
  /** Location, date/time, group size — shown only when representing a specific example. */
  meta?: string[];
  href?: string;
  /** Defaults true until real listings exist for a gathering. */
  isExample?: boolean;
  className?: string;
}

/**
 * Gathering Card — docs/design/design-system.md ("Gathering Cards")
 * Category label, title, one-line description, optional detail block.
 */
export function GatheringCard({
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  meta,
  href,
  isExample = true,
  className,
}: GatheringCardProps) {
  const content = (
    <Card className={className}>
      <CardImage>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 380px, 100vw"
        />
        <CategoryTag>{category}</CategoryTag>
      </CardImage>
      <CardBody>
        {isExample && <ExampleTag />}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {meta && meta.length > 0 && (
          <CardMeta>
            {meta.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </CardMeta>
        )}
      </CardBody>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
