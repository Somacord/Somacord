import type { Metadata } from "next";
import Link from "next/link";

import { GatheringsBrowser } from "@/components/gatherings/gatherings-browser";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";
import {
  getCityIdBySlug,
  getPublishedGatherings,
  type GatheringSummary,
} from "@/lib/queries/gatherings";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Gatherings",
  description: `Browse community and Community Partner gatherings, plus free Speed Connect sessions, in ${siteConfig.launchCity.name}.`,
};

const speedConnectTile: GatheringSummary = {
  id: "speed-connect",
  title: "Free Speed Connect",
  category: "Start here",
  shortDescription: "The easiest way to meet a few new people this week.",
  imageSrc: photography.coffeeGathering.src,
  imageAlt: photography.coffeeGathering.alt,
  location: "Virtual & in-person",
  schedule: "Daily slots",
  href: "/speed-connect",
};

export default async function GatheringsPage() {
  const current = await getCurrentUser();
  const cityId = await getCityIdBySlug(siteConfig.launchCity.slug);
  const gatherings = cityId ? await getPublishedGatherings(cityId) : [];

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Gatherings"
          title="Something's always happening nearby"
          subhead={`Community-created meetups, Community Partner experiences, and free Speed Connect sessions in ${siteConfig.launchCity.name}.`}
          action={
            current ? (
              <Button asChild variant="secondary-light" size="small">
                <Link href="/gatherings/create">Create a Gathering</Link>
              </Button>
            ) : undefined
          }
        />
        <GatheringsBrowser gatherings={[speedConnectTile, ...gatherings]} />
      </Container>
    </Section>
  );
}
