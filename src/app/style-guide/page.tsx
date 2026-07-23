import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CategoryTag, ExampleTag, PillTag } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardImage, CardTitle } from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FilterPill } from "@/components/ui/filter-pill";
import { GatheringCard } from "@/components/ui/gathering-card";
import { PartnerTypeCard } from "@/components/ui/partner-type-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { Steps } from "@/components/ui/steps";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Style Guide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Deep Cord Blue", hex: "#1F4E5F", className: "bg-cord-blue" },
  { name: "Community Green", hex: "#5E8C61", className: "bg-community-green" },
  { name: "Soft Sky", hex: "#D9EEF2", className: "bg-soft-sky" },
  { name: "Warm Sand", hex: "#E8DCCB", className: "bg-warm-sand" },
  { name: "Charcoal", hex: "#273238", className: "bg-charcoal" },
  { name: "White", hex: "#FFFFFF", className: "border border-soft-sky bg-white" },
];

/**
 * Internal design-system reference. Not linked from the primary nav —
 * exists so engineers building feature pages can see every reusable UI
 * component rendered together, matched against the approved mockups.
 */
export default function StyleGuidePage() {
  return (
    <div className="divide-soft-sky divide-y">
      <Section>
        <Container>
          <Eyebrow>Somacord Design System</Eyebrow>
          <h1 className="mb-3 text-4xl">Foundation style guide</h1>
          <p className="text-ink-muted max-w-2xl">
            Internal reference for the shared layout, tokens, and reusable UI components built in
            this foundation pass. Source of truth: <code>/somacord-docs/docs/design</code> and{" "}
            <code>/somacord-docs/docs/brand</code>.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Tokens" title="Color palette" subhead="docs/brand/colors.md" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map((swatch) => (
              <div key={swatch.name}>
                <div className={`rounded-card mb-2 h-20 ${swatch.className}`} />
                <p className="text-sm font-medium">{swatch.name}</p>
                <p className="text-ink-muted text-xs">{swatch.hex}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader eyebrow="Tokens" title="Typography" subhead="docs/brand/typography.md" />
          <div className="space-y-4">
            <p className="font-display text-[58px] leading-none">Lora / Hero 58px</p>
            <p className="font-display text-[34px]">Lora / Section heading 34px</p>
            <p className="font-display text-xl">Lora / Card title 19–20px</p>
            <p className="text-base">Work Sans / Body 16px</p>
            <p className="text-ink-muted text-sm">Work Sans / Meta &amp; muted copy 13–14px</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Component"
            title="Buttons"
            subhead="docs/design/design-system.md"
          />
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Join a Free Speed Connect</Button>
            <Button variant="secondary-light">See Membership</Button>
            <div className="rounded-card bg-cord-blue p-4">
              <Button variant="secondary-dark">Browse Gatherings</Button>
            </div>
            <Button variant="primary" size="small">
              Become a Partner
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader eyebrow="Component" title="Tags &amp; badges" />
          <div className="flex flex-wrap items-center gap-4">
            <ExampleTag />
            <span className="rounded-card bg-cord-blue relative inline-block p-6">
              <CategoryTag>Community</CategoryTag>
            </span>
            <PillTag>Hiking</PillTag>
            <PillTag>Board games</PillTag>
            <PillTag>Coffee</PillTag>
            <FilterPill active>All</FilterPill>
            <FilterPill>Speed Connect</FilterPill>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Component"
            title="Gathering card"
            subhead="docs/design/design-system.md"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <GatheringCard
              category="Community"
              title="Saturday Coffee Meetup"
              description="A relaxed weekly meetup for regulars and newcomers alike."
              imageSrc={photography.coffeeGathering.src}
              imageAlt={photography.coffeeGathering.alt}
              meta={["📍 The Daily Bean, Salt Lake City", "🗓 Saturdays, 10:00 AM"]}
            />
            <GatheringCard
              category="Partner"
              title="Community Dinner"
              description="A shared-plates dinner hosted by a local partner restaurant."
              imageSrc={photography.dinnerGathering.src}
              imageAlt={photography.dinnerGathering.alt}
              meta={["📍 The Gilded Fork", "🗓 Fridays, 7:00 PM"]}
            />
            <GatheringCard
              category="Start here"
              title="Board Game Night"
              description="Low-pressure games, snacks, and new faces every week."
              imageSrc={photography.gameNight.src}
              imageAlt={photography.gameNight.alt}
              meta={["📍 Member host home", "🗓 Wednesdays, 7:00 PM"]}
            />
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader eyebrow="Component" title="Base card &amp; avatar" />
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardImage>
                <div className="bg-soft-sky text-ink-muted flex h-full items-center justify-center text-sm">
                  Image slot
                </div>
              </CardImage>
              <CardBody>
                <CardTitle>Generic card</CardTitle>
                <CardDescription>
                  The base primitive GatheringCard and future card variants build on.
                </CardDescription>
              </CardBody>
            </Card>
            <div>
              <p className="mb-3 text-sm font-medium">
                Avatar stack (&ldquo;who&apos;s going&rdquo;)
              </p>
              <div className="flex gap-2.5">
                <Avatar src={photography.memberProfilePortrait01.src} alt="Member" />
                <Avatar src={photography.memberProfilePortrait01.src} alt="Member" opacity={0.7} />
                <Avatar src={photography.memberProfilePortrait01.src} alt="Member" opacity={0.5} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Component"
            title="Steps"
            subhead="docs/product/vision.md — Guided, not mechanical"
          />
          <Steps
            steps={[
              {
                number: 1,
                title: "Try Speed Connect, free",
                description: "A short, guided conversation experience — no commitment.",
              },
              {
                number: 2,
                title: "Meet a few new people",
                description: "Built for genuine first conversations, not a crowd.",
              },
              {
                number: 3,
                title: "Turn it into friendship",
                description: "Join gatherings, meet the same faces again.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader eyebrow="Component" title="Split layout" />
          <SplitLayout
            imageSrc={photography.walkingTogether.src}
            imageAlt={photography.walkingTogether.alt}
          >
            <Eyebrow>Membership Preview</Eyebrow>
            <h3 className="mb-3 text-2xl">One membership. One price. One community.</h3>
            <CheckList
              items={[
                "Unlimited Speed Connect sessions",
                "Full access to community & partner gatherings",
              ]}
            />
            <Button variant="primary">See Membership</Button>
          </SplitLayout>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Component"
            title="Pricing card"
            subhead="docs/business/pricing.md"
          />
          <PricingCard
            eyebrow={siteConfig.membership.name}
            plans={siteConfig.membership.plans}
            benefits={siteConfig.membership.benefits}
            ctaLabel="Become a Member"
            ctaHref="/membership"
            footnote="Community Partners are organizations, not members — see /partners for how they work with Somacord instead."
          />
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader eyebrow="Component" title="Partner type cards" />
          <div className="grid gap-5 sm:grid-cols-3">
            <PartnerTypeCard
              icon="☕"
              title="Coffee shops"
              description="Host standing meetups for your regulars."
            />
            <PartnerTypeCard
              icon="🍽"
              title="Restaurants"
              description="Turn slow nights into community dinners."
            />
            <PartnerTypeCard
              icon="🥾"
              title="Hobby & hiking groups"
              description="Grow your group with people actively looking to join."
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
