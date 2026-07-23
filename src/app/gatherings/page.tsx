import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GatheringsBrowser } from "@/components/gatherings/gatherings-browser";
import { SectionHeader } from "@/components/ui/section-header";
import { siteConfig } from "@/config/site";
import { gatherings } from "@/data/gatherings";

export const metadata: Metadata = {
  title: "Gatherings",
  description: `Browse community and Community Partner gatherings, plus free Speed Connect sessions, in ${siteConfig.launchCity.name}.`,
};

/** Gatherings discovery — docs/design/website-mockups.md ("Gatherings (discovery)"). */
export default function GatheringsPage() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Gatherings"
          title="Something's always happening nearby"
          subhead={`Community-created meetups, Community Partner experiences, and free Speed Connect sessions in ${siteConfig.launchCity.name}.`}
        />
        <GatheringsBrowser gatherings={gatherings} />
      </Container>
    </Section>
  );
}
