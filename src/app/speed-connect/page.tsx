import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { Steps } from "@/components/ui/steps";
import { howItWorksJourney } from "@/data/content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Speed Connect is a short, guided conversation experience — free, low-pressure, and the easiest way to meet a few new people.",
};

/**
 * Speed Connect / "How It Works" — docs/design/website-mockups.md
 * ("Speed Connect") plus a broader journey section per the approved MVP
 * build plan for this phase (Discover → Join a Speed Connect → Attend
 * Gatherings → Build Friendships, condensed from
 * docs/product/user-journey.md).
 */
export default function SpeedConnectPage() {
  return (
    <>
      <Section tone="dark">
        <Container className="max-w-xl text-center">
          <Eyebrow className="text-warm-sand">Free · No Commitment</Eyebrow>
          <h1 className="mb-4 text-[36px]">The easiest way to meet a few new people</h1>
          <p className="mb-8 text-white/85">
            Speed Connect is a short, guided conversation experience — just enough structure to make
            a first hello easy, then it gets out of the way.
          </p>
          <Button asChild variant="primary">
            <Link href="/signup">Join a Free Speed Connect</Link>
          </Button>
        </Container>
      </Section>

      <Section>
        <Container>
          <Steps
            steps={[
              {
                number: 1,
                title: "What to expect",
                description:
                  "A short series of guided conversation prompts with a few other people — no scripts to memorize, no performance pressure.",
              },
              {
                number: 2,
                title: "Why it's low pressure",
                description:
                  "Everyone's here for the same reason. There's no swiping, no ranking, no appearance-first anything — just people trying to make a genuine connection.",
              },
              {
                number: 3,
                title: "What happens after",
                description:
                  "Liked who you met? Follow up, join a gathering together, or come back for another round whenever you want.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="From first hello to real friendship"
            subhead="The path most people take on Somacord, start to finish."
          />
          <Steps steps={howItWorksJourney} />
        </Container>
      </Section>

      <Section tone="sky">
        <Container className="max-w-xl text-center">
          <h2 className="mb-4 text-[30px]">Your first Speed Connect is free.</h2>
          <p className="text-ink-muted mb-8">No membership required to try it.</p>
          <Button asChild variant="primary">
            <Link href="/signup">Join a Free Speed Connect</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
