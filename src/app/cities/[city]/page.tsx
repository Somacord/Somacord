import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CategoryTag, ExampleTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardDescription, CardImage, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { GatheringCard } from "@/components/ui/gathering-card";
import { Hero } from "@/components/ui/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { cities, getCityBySlug } from "@/data/cities";
import { getCityIdBySlug, getPublishedGatherings } from "@/lib/queries/gatherings";

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) return {};

  return {
    title: `Somacord in ${city.name}`,
    description: `Find your people in ${city.name} — coffee meetups, hikes, community dinners, and free Speed Connect sessions.`,
  };
}

/**
 * City page — docs/design/website-mockups.md ("City (Salt Lake City)")
 * plus docs/website/seo-strategy.md's city-landing-page pattern (example
 * gatherings + activity categories, a Speed Connect CTA above the fold,
 * and a link to Community Partners in the city).
 */
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const cityId = await getCityIdBySlug(city.slug);
  const featured = cityId ? await getPublishedGatherings(cityId, 3) : [];

  return (
    <>
      <Hero
        imageSrc={city.heroImage.src}
        imageAlt={city.heroImage.alt}
        size="md"
        title={`Find your people in ${city.name}`}
        description={city.heroDescription}
        actions={
          <Button asChild variant="primary">
            <Link href="/speed-connect">Join a Free Speed Connect</Link>
          </Button>
        }
      />

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Local Activity Categories"
            title="The kinds of places we gather"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {city.activityCategories.map((category) => (
              <Card key={category.title}>
                <CardImage>
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 380px, 100vw"
                  />
                  <CategoryTag>{category.tag}</CategoryTag>
                </CardImage>
                <CardBody>
                  <ExampleTag />
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription className="mb-0">{category.description}</CardDescription>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sky">
        <Container>
          <SectionHeader
            eyebrow="Gatherings"
            title={`Happening around ${city.name}`}
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
            <EmptyState
              title={`No gatherings live in ${city.name} yet`}
              description="Be the first member or Community Partner to create one."
              action={
                <Button asChild variant="primary">
                  <Link href="/gatherings/create">Create a Gathering</Link>
                </Button>
              }
            />
          )}
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="max-w-xl text-center">
          <h2 className="mb-4 text-[30px]">Already bring people together in {city.name}?</h2>
          <p className="text-sand-ink mb-8">
            Coffee shops, restaurants, clubs, and hobby groups can join Somacord as Community
            Partners.
          </p>
          <Button asChild variant="secondary-light">
            <Link href="/partners">Become a Partner</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
