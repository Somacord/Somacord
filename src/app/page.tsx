import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CheckList } from "@/components/ui/check-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Faq } from "@/components/ui/faq";
import { GatheringCard } from "@/components/ui/gathering-card";
import { Hero } from "@/components/ui/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { Steps } from "@/components/ui/steps";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";
import { homeFaqs } from "@/data/faq";
import { getCityIdBySlug, getPublishedGatherings } from "@/lib/queries/gatherings";

/**
 * Homepage — docs/design/website-mockups.md ("Homepage").
 * Section order: Hero → How It Works → Featured Gatherings → Membership
 * Preview → Community Partners → FAQ → Final CTA. Membership comes
 * before the Community Partners teaser since the primary homepage
 * audience is individual visitors, not businesses — see the first-time-
 * visitor audit that reordered this from the original build-plan order.
 */
export default async function HomePage() {
  const cityId = await getCityIdBySlug(siteConfig.launchCity.slug);
  const featured = cityId ? await getPublishedGatherings(cityId, 3) : [];

  return (
    <>
      <Hero
        imageSrc={photography.homepageHero1.src}
        imageAlt={photography.homepageHero1.alt}
        title="Real friendships start with one hello."
        description="Somacord is free to join. Attend local gatherings and try the experience for yourself. Membership comes later if you love it."
        actions={
          <>
            <Button asChild variant="primary">
              <Link href="/signup">Join Free &amp; Find Your Community</Link>
            </Button>
            <Button asChild variant="secondary-dark">
              <Link href="/gatherings">Explore Gatherings</Link>
            </Button>
          </>
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
          <SectionHeader
            eyebrow="Gatherings Showcase"
            title="Something's always happening nearby"
            action={
              <Button asChild variant="secondary-light" size="small">
                <Link href="/gatherings">See all gatherings</Link>
              </Button>
            }
          />
          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((gathering) => (
                <GatheringCard
                  key={gathering.id}
                  title={gathering.title}
                  description={gathering.shortDescription}
                  category={gathering.category}
                  imageSrc={gathering.imageSrc}
                  imageAlt={gathering.imageAlt}
                  meta={[`📍 ${gathering.location}`, `🗓 ${gathering.schedule}`]}
                  href={gathering.href}
                  isExample={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-ink-muted">
              {siteConfig.launchCity.name} gatherings are just getting started — check back soon, or{" "}
              <Link href="/speed-connect" className="text-cord-blue font-medium underline">
                join a free Speed Connect
              </Link>{" "}
              in the meantime.
            </p>
          )}
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
          <h2 className="mb-4 text-[36px]">Your first gathering is one free account away.</h2>
          <p className="mb-8 text-white/85">
            Simple to join and free to start. See what is happening near you this week.
          </p>
          <Button asChild variant="primary">
            <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
