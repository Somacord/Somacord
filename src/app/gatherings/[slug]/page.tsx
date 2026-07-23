import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AttendeeStack } from "@/components/gatherings/attendee-stack";
import { RsvpButton } from "@/components/gatherings/rsvp-button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CategoryTag, ExampleTag } from "@/components/ui/badge";
import { GatheringCard } from "@/components/ui/gathering-card";
import { SectionHeader } from "@/components/ui/section-header";
import { photography } from "@/config/media";
import {
  gatherings,
  getGatheringBySlug,
  getGatheringHref,
  getRelatedGatherings,
} from "@/data/gatherings";

export function generateStaticParams() {
  return gatherings
    .filter((gathering) => !gathering.external)
    .map((gathering) => ({ slug: gathering.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gathering = getGatheringBySlug(slug);

  if (!gathering) return {};

  return {
    title: gathering.title,
    description: gathering.shortDescription,
  };
}

/** Gathering detail — docs/design/website-mockups.md ("Gathering Detail"). */
export default async function GatheringDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gathering = getGatheringBySlug(slug);

  if (!gathering) {
    notFound();
  }

  const related = getRelatedGatherings(slug);

  return (
    <>
      <Section>
        <Container>
          <ExampleTag />
          <div className="rounded-card-lg relative mb-8 h-[240px] overflow-hidden sm:h-[380px]">
            <Image
              src={gathering.imageSrc}
              alt={gathering.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 1100px, 100vw"
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div>
              <CategoryTag className="static mb-3 inline-block">{gathering.category}</CategoryTag>
              <h1 className="mb-3 text-[32px]">{gathering.title}</h1>
              <p className="text-ink-muted mb-7 text-base leading-[1.7]">{gathering.description}</p>

              <h2 className="mb-2.5 text-lg">Who&apos;s going</h2>
              <div className="mb-7">
                <AttendeeStack imageSrc={photography.memberProfilePortrait01.src} />
              </div>

              <RsvpButton />
            </div>

            <div className="rounded-card border-soft-sky bg-soft-sky/60 h-fit border p-7 lg:sticky lg:top-24">
              <DetailRow label="Location" value={gathering.location} />
              <DetailRow label="Date & time" value={gathering.schedule} />
              <DetailRow label="Group size" value={gathering.groupSize} />
              <DetailRow label="Hosted by" value={gathering.hostedBy} last />
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="sky">
          <Container>
            <SectionHeader eyebrow="Keep Exploring" title="You might also like" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <GatheringCard
                  key={item.slug}
                  title={item.title}
                  description={item.shortDescription}
                  category={item.category}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  meta={[`📍 ${item.location}`, `🗓 ${item.schedule}`]}
                  href={getGatheringHref(item)}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-4 py-2.5 text-sm ${last ? "" : "border-cord-blue/10 border-b"}`}
    >
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink text-right font-medium">{value}</span>
    </div>
  );
}
