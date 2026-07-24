import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Faq } from "@/components/ui/faq";
import { Hero } from "@/components/ui/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { Steps } from "@/components/ui/steps";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";
import { homeFaqs } from "@/data/faq";

/**
 * Homepage — Salt Lake City founding-member early-access page. No specific
 * event, date, or venue is claimed here (none exists yet) — the page's job
 * is capturing free signups before a venue/partner is secured, not showing
 * off gatherings. Section order: Hero → How It Works → Membership Preview
 * → Community Partners → FAQ → Final CTA.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        imageSrc={photography.homepageHero1.src}
        imageAlt={photography.homepageHero1.alt}
        title="Be one of the first to join Somacord in Salt Lake City."
        description="Somacord is free to join. Reserve your spot as a founding Salt Lake City member. Membership comes later if you love it."
        actions={
          <Button asChild variant="primary">
            <Link href="/signup">Reserve Your Spot as a Founding Member</Link>
          </Button>
        }
      />

      <Section tone="sky">
        <Container>
          <SectionHeader eyebrow="How It Works" title="Low-pressure, by design" />
          <Steps
            steps={[
              {
                number: 1,
                title: "Discover what's happening nearby",
                description:
                  "Browse community and Community Partner gatherings — no account required to look around.",
              },
              {
                number: 2,
                title: "Try Speed Connect, free",
                description:
                  "A short, guided conversation experience — no commitment, no awkward small talk to figure out on your own.",
              },
              {
                number: 3,
                title: "Turn it into friendship",
                description:
                  "Join gatherings, meet the same faces again, and let real connection build over time.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SplitLayout
            imageSrc={photography.dinnerGathering.src}
            imageAlt={photography.dinnerGathering.alt}
          >
            <Eyebrow>Membership Preview</Eyebrow>
            <h2 className="mb-4 text-[32px]">An optional upgrade, whenever you&apos;re ready.</h2>
            <p className="mb-6 text-base leading-relaxed text-[#55636A]">
              The {siteConfig.membership.name} is $29/month, one flat price — no tiers, no add-ons.
              It&apos;s entirely optional, and directly supports Somacord as we grow in{" "}
              {siteConfig.launchCity.name}.
            </p>
            <CheckList
              items={[
                "Optional — not required to join or use Somacord",
                "One flat price — no tiers, no hidden fees",
                "Support Somacord as an early member while we grow",
              ]}
            />
            <Button asChild variant="primary">
              <Link href="/membership">See Membership</Link>
            </Button>
          </SplitLayout>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SplitLayout
            imageSrc={photography.communityPartner.src}
            imageAlt={photography.communityPartner.alt}
            reverse
          >
            <Eyebrow>Community Partners</Eyebrow>
            <h2 className="mb-4 text-[32px]">
              Local spots already bring people together. We help them do it better.
            </h2>
            <p className="mb-6 text-base leading-relaxed text-[#55636A]">
              Coffee shops, restaurants, clubs, and hobby groups partner with Somacord as
              organizations — not members — to bring their existing community in and reach new
              people looking for exactly what they offer.
            </p>
            <Button asChild variant="secondary-light">
              <Link href="/partners">Become a Partner</Link>
            </Button>
          </SplitLayout>
        </Container>
      </Section>

      <Section tone="sky">
        <Container className="max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="Common questions" align="center" />
          <Faq items={homeFaqs} />
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="max-w-xl text-center">
          <Eyebrow className="text-warm-sand">Ready when you are</Eyebrow>
          <h2 className="mb-4 text-[36px]">Reserve your spot as a founding member.</h2>
          <p className="mb-8 text-white/85">
            Simple to join and free to start. We will email you the moment the first event is
            announced.
          </p>
          <Button asChild variant="primary">
            <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
