import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ExampleTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardImage, CardTitle } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Faq } from "@/components/ui/faq";
import { PricingCard } from "@/components/ui/pricing-card";
import { SectionHeader } from "@/components/ui/section-header";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";
import { membershipFaqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Membership",
  description: `The ${siteConfig.membership.name} — $${siteConfig.membership.price}/${siteConfig.membership.interval} for community access, local gatherings, and ongoing Speed Connect.`,
};

const exampleMonth = [
  {
    title: "4 coffee meetups",
    description: "Drop into a standing weekly gathering, no RSVP pressure.",
    image: photography.coffeeGathering,
  },
  {
    title: "2 group hikes",
    description: "Get outside with people who show up consistently.",
    image: photography.hikingGathering,
  },
  {
    title: "1 game night",
    description: "Low-key, recurring, easy to become a regular.",
    image: photography.gameNight,
  },
];

/** Membership — docs/design/website-mockups.md ("Membership"). */
export default function MembershipPage() {
  return (
    <>
      <Section tone="sky">
        <Container>
          <div className="mx-auto mb-12 max-w-xl text-center">
            <Eyebrow>Founding Membership</Eyebrow>
            <h1 className="text-[34px]">
              One membership. One price.
              <br />
              Everyone joins the same community.
            </h1>
          </div>
          <PricingCard
            eyebrow={siteConfig.membership.name}
            price={siteConfig.membership.price}
            interval={siteConfig.membership.interval}
            benefits={siteConfig.membership.benefits}
            ctaLabel="Become a Founding Member"
            ctaHref="/signup"
            footnote={
              <>
                Community Partners pay the same $39/month — the difference is role, not price.{" "}
                <Link href="/partners" className="underline">
                  Learn about Partners →
                </Link>
              </>
            }
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Example Month"
            title="What a month on Somacord looks like"
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {exampleMonth.map((item) => (
              <Card key={item.title}>
                <CardImage>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 380px, 100vw"
                  />
                </CardImage>
                <CardBody>
                  <ExampleTag />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="mb-0">{item.description}</CardDescription>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container className="max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="Membership questions" align="center" />
          <Faq items={membershipFaqs} />
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="max-w-xl text-center">
          <h2 className="mb-4 text-[36px]">Ready to become a Founding Member?</h2>
          <p className="mb-8 text-white/85">
            Join for ${siteConfig.membership.price}/{siteConfig.membership.interval} and get full
            access to {siteConfig.launchCity.name}&apos;s gatherings, Speed Connect, and community.
          </p>
          <Button asChild variant="primary">
            <Link href="/signup">Become a Founding Member</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
