import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AttendeeStack } from "@/components/gatherings/attendee-stack";
import { RsvpButton } from "@/components/gatherings/rsvp-button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CategoryTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GatheringCard } from "@/components/ui/gathering-card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  getGatheringBySlug,
  getGatheringRsvpCount,
  getRelatedGatherings,
  getUserRsvpStatus,
} from "@/lib/queries/gatherings";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gathering = await getGatheringBySlug(slug, null);

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
  const current = await getCurrentUser();
  const gathering = await getGatheringBySlug(slug, current?.user.id ?? null);

  if (!gathering) {
    notFound();
  }

  const [related, goingCount, isGoing] = await Promise.all([
    getRelatedGatherings(gathering.id, gathering.cityId),
    getGatheringRsvpCount(gathering.id),
    current ? getUserRsvpStatus(gathering.id, current.user.id) : Promise.resolve(false),
  ]);

  const isOwnerPreviewingDraft =
    gathering.status === "draft" && current?.user.id === gathering.createdBy;

  return (
    <>
      <Section>
        <Container>
          {isOwnerPreviewingDraft && (
            <div className="rounded-card border-warm-sand bg-warm-sand/40 mb-6 flex flex-wrap items-center justify-between gap-3 border px-5 py-4">
              <p className="text-sm font-medium">
                This gathering is a draft — only you can see it.
              </p>
              <Button asChild variant="secondary-light" size="small">
                <Link href={`/gatherings/${gathering.slug}/edit`}>Edit &amp; Publish</Link>
              </Button>
            </div>
          )}

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
                <AttendeeStack count={goingCount} />
              </div>

              <RsvpButton
                gatheringId={gathering.id}
                slug={gathering.slug}
                isGoing={isGoing}
                isSignedIn={Boolean(current)}
              />
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
                  key={item.id}
                  title={item.title}
                  description={item.shortDescription}
                  category={item.category}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                  meta={[`📍 ${item.location}`, `🗓 ${item.schedule}`]}
                  href={item.href}
                  isExample={false}
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
