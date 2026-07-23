import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { PartnerTypeCard } from "@/components/ui/partner-type-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Steps } from "@/components/ui/steps";
import { photography } from "@/config/media";
import { partnerHowItWorks, whyPartner } from "@/data/content";

export const metadata: Metadata = {
  title: "Community Partners",
  description:
    "Join Somacord as a Community Partner and turn your regulars into an ongoing community — same $39/month membership, plus gathering tools.",
};

const partnerTypes = [
  { icon: "☕", title: "Coffee shops", description: "Host standing meetups for your regulars." },
  { icon: "🍽", title: "Restaurants", description: "Turn slow nights into community dinners." },
  {
    icon: "🥾",
    title: "Hobby & hiking groups",
    description: "Grow your group with people actively looking to join.",
  },
  { icon: "🎲", title: "Clubs", description: "Give members a reason to invite a friend." },
  {
    icon: "📅",
    title: "Event organizers",
    description: "List experiences alongside community gatherings.",
  },
  {
    icon: "🏘",
    title: "Community organizations",
    description: "Reach adults actively looking for local connection.",
  },
];

/** Community Partners — docs/design/website-mockups.md ("Community Partners"). */
export default function PartnersPage() {
  return (
    <>
      <Hero
        imageSrc={photography.communityPartner.src}
        imageAlt={photography.communityPartner.alt}
        size="md"
        title="You already bring people together. Let's make it easier."
        description="Join Somacord as a Community Partner and turn your regulars into an ongoing community — same $39/month membership, plus gathering tools."
        actions={
          <Button asChild variant="primary">
            <Link href="/signup">Become a Partner</Link>
          </Button>
        }
      />

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Who It's For"
            title="Built for local community builders"
            subhead="If you already bring people together, Somacord gives you a simple way to grow it."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map((type) => (
              <PartnerTypeCard
                key={type.title}
                icon={type.icon}
                title={type.title}
                description={type.description}
              />
            ))}
          </div>

          <div className="rounded-card bg-warm-sand mt-4 px-8 py-7">
            <h3 className="mb-2 text-lg">One membership, not a separate tier</h3>
            <p className="text-sand-ink text-sm">
              Partners pay the same $39/month Founding Membership as every member. The difference is
              role and ability — partners get gathering-organizing tools and can invite their
              existing community into Somacord.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader
            eyebrow="Why Partner With Somacord"
            title="What you get as a Community Partner"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {whyPartner.map((item) => (
              <PartnerTypeCard
                key={item.title}
                icon="✓"
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="How It Works"
            title="From your first gathering to a growing community"
          />
          <Steps steps={partnerHowItWorks} />
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="max-w-xl text-center">
          <h2 className="mb-4 text-[36px]">Ready to bring your community to Somacord?</h2>
          <p className="mb-8 text-white/85">
            Apply as a Community Partner — same $39/month membership, plus tools to organize and
            grow your gatherings.
          </p>
          <Button asChild variant="primary">
            <Link href="/signup">Become a Partner</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
