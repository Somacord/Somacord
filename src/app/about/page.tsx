import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PartnerTypeCard } from "@/components/ui/partner-type-card";
import { PillTag } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { photography } from "@/config/media";
import { values, whoSomacordIsFor } from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Somacord helps adults build real friendships through guided conversations and shared experiences.",
};

const valueIcons = ["👀", "🤝", "💳", "🧭", "📌"];

/** About — docs/design/website-mockups.md ("About"). */
export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <SplitLayout
            imageSrc={photography.walkingTogether.src}
            imageAlt={photography.walkingTogether.alt}
          >
            <Eyebrow>Our Mission</Eyebrow>
            <h1 className="mb-4 text-[34px]">Helping adults build real friendships</h1>
            <p className="text-ink-muted mb-4 text-base leading-relaxed">
              Somacord helps adults build real friendships through guided conversations and shared
              experiences. We&apos;re a friendship-first social club — closer to Airbnb Experiences
              and modern hospitality than a dating app, a social feed, or a networking tool.
            </p>
            <p className="text-ink-muted text-base leading-relaxed">
              We believe in showing connection, not explaining loneliness; in guided structure over
              mechanical matching; and in membership that deepens engagement without ever gating
              discovery — anyone can browse gatherings or try Speed Connect before they join.
            </p>
          </SplitLayout>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader
            eyebrow="Why Somacord Exists"
            title="Adults want a better social life"
            subhead="But lack an easy, low-pressure way to meet good people and turn first meetings into ongoing friendships."
          />
          <div className="flex flex-wrap gap-2">
            {whoSomacordIsFor.map((who) => (
              <PillTag key={who} className="bg-white">
                {who}
              </PillTag>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader eyebrow="Our Values" title="What we hold onto as we build" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <PartnerTypeCard
                key={value.title}
                icon={valueIcons[index] ?? "•"}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="primary">
              <Link href="/signup">Join Somacord</Link>
            </Button>
            <p className="text-ink-muted mt-3 text-sm">Free to join — no credit card required.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
