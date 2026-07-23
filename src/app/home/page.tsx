import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ExampleTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GatheringCard } from "@/components/ui/gathering-card";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import {
  communityUpdates,
  getMyRsvps,
  getRecommendedGatherings,
  getUpcomingGatherings,
  getUpcomingSpeedConnect,
} from "@/data/dashboard";
import { getGatheringHref } from "@/data/gatherings";
import { requireOnboarded } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Home",
  robots: { index: false, follow: false },
};

/**
 * Member Dashboard — docs/website/sitemap.md's `/home` ("Member home:
 * this week, Speed Connect booking"). All gathering/session/update data
 * here is placeholder content per this milestone's brief — no backend
 * event logic (RSVP persistence, real Speed Connect scheduling) is wired
 * up yet.
 */
export default async function HomePage() {
  const { user } = await requireOnboarded();

  const upcoming = getUpcomingGatherings();
  const recommended = getRecommendedGatherings();
  const myRsvps = getMyRsvps();
  const speedConnect = getUpcomingSpeedConnect();
  const firstName = user.name?.split(" ")[0];

  return (
    <Section>
      <Container>
        <div className="mb-10">
          <h1 className="mb-2 text-[32px]">Welcome back{firstName ? `, ${firstName}` : ""}</h1>
          <p className="text-ink-muted">
            Here&apos;s what&apos;s happening in {user.city ?? "your city"} this week.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            <div>
              <SectionHeader
                eyebrow="This Week"
                title="Upcoming Gatherings"
                action={
                  <Button asChild variant="secondary-light" size="small">
                    <Link href="/gatherings">Browse all</Link>
                  </Button>
                }
              />
              {upcoming.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {upcoming.map((gathering) => (
                    <GatheringCard
                      key={gathering.slug}
                      title={gathering.title}
                      description={gathering.shortDescription}
                      category={gathering.category}
                      imageSrc={gathering.imageSrc}
                      imageAlt={gathering.imageAlt}
                      meta={[`📍 ${gathering.location}`, `🗓 ${gathering.schedule}`]}
                      href={getGatheringHref(gathering)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-ink-muted text-sm">
                  No upcoming gatherings yet — browse what&apos;s nearby.
                </p>
              )}
            </div>

            <div>
              <SectionHeader eyebrow="For You" title="Recommended Gatherings" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((gathering) => (
                  <GatheringCard
                    key={gathering.slug}
                    title={gathering.title}
                    description={gathering.shortDescription}
                    category={gathering.category}
                    imageSrc={gathering.imageSrc}
                    imageAlt={gathering.imageAlt}
                    meta={[`📍 ${gathering.location}`, `🗓 ${gathering.schedule}`]}
                    href={getGatheringHref(gathering)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader eyebrow="Your Activity" title="My RSVPs" />
              {myRsvps.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myRsvps.map((gathering) => (
                    <GatheringCard
                      key={gathering.slug}
                      title={gathering.title}
                      description={gathering.shortDescription}
                      category={gathering.category}
                      imageSrc={gathering.imageSrc}
                      imageAlt={gathering.imageAlt}
                      meta={[`📍 ${gathering.location}`, `🗓 ${gathering.schedule}`]}
                      href={getGatheringHref(gathering)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-ink-muted text-sm">
                  You haven&apos;t RSVP&apos;d to anything yet —{" "}
                  <Link href="/gatherings" className="text-cord-blue font-medium underline">
                    find a gathering
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <Panel>
              <ExampleTag />
              <h3 className="mb-1 text-lg">Speed Connect</h3>
              {speedConnect ? (
                <>
                  <p className="text-ink mb-1 text-sm font-medium">{speedConnect.scheduledFor}</p>
                  <p className="text-ink-muted mb-4 text-sm">{speedConnect.format}</p>
                  <Button variant="secondary-light" size="small" className="w-full">
                    Manage booking
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-ink-muted mb-4 text-sm">No upcoming session booked.</p>
                  <Button asChild variant="primary" size="small" className="w-full">
                    <Link href="/speed-connect">Book a Speed Connect</Link>
                  </Button>
                </>
              )}
            </Panel>

            <Panel>
              <h3 className="mb-4 text-lg">Community Updates</h3>
              <div className="space-y-4">
                {communityUpdates.map((update) => (
                  <div
                    key={update.title}
                    className="border-soft-sky border-b pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-ink mb-1 text-sm font-medium">{update.title}</p>
                    <p className="text-ink-muted text-xs">{update.description}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </Container>
    </Section>
  );
}
