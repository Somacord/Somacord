import type { Metadata } from "next";
import Link from "next/link";

import { PartnerInquiryForm } from "@/components/forms/partner-inquiry-form";
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
    "Join Somacord as a Community Partner and bring your existing community with you. This is a partnership built for your organization. It is not a membership.",
};

const partnerEventFormats = [
  {
    icon: "🆓",
    title: "Free",
    description: "No cost to attend. An easy way to introduce your regulars to Somacord.",
  },
  {
    icon: "🎟",
    title: "Ticketed",
    description: "Set your own price. Bundle in a drink or a meal or an activity.",
  },
  {
    icon: "💛",
    title: "Pay what you want",
    description: "Works well if that fits your community better.",
  },
  {
    icon: "🔒",
    title: "Members Only or Discounted",
    description: "Give Somacord members a discount or first access.",
  },
];

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
        description="Join Somacord as a Community Partner and bring your existing community with you. This is a partnership built for your organization. It is not a membership."
        actions={
          <Button asChild variant="primary">
            <Link href="#apply">Become a Partner</Link>
          </Button>
        }
      />

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Who It's For"
            title="Built for local community builders"
            subhead="You already bring people together. Somacord gives you a simple way to grow it."
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
            <h3 className="mb-2 text-lg">A partnership. Not a membership.</h3>
            <p className="text-sand-ink text-sm">
              Community Partners are organizations. They are not members. They do not sign up for
              the Somacord Membership. Instead we work out the right fit for your organization. That
              could be a single event. It could be an ongoing partnership. Reach out and we&apos;ll
              figure out what makes sense together.
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

      <Section tone="sand">
        <Container>
          <SectionHeader
            eyebrow="How Partner Events Work"
            title="You set the format. We bring the people."
            subhead="Free or ticketed or donation based or members only. It's your event priced your way."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partnerEventFormats.map((format) => (
              <PartnerTypeCard
                key={format.title}
                icon={format.icon}
                title={format.title}
                description={format.description}
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
        <Container id="apply" className="max-w-xl scroll-mt-24 text-center">
          <h2 className="mb-4 text-[36px]">Ready to bring your community to Somacord?</h2>
          <p className="mb-8 text-white/85">
            Tell us about your organization. A member of our team will follow up to figure out the
            right fit. That could be a single event or an ongoing partnership.
          </p>
          <PartnerInquiryForm />
        </Container>
      </Section>
    </>
  );
}
