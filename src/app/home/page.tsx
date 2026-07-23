import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ExampleTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GatheringCard } from "@/components/ui/gathering-card";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { siteConfig } from "@/config/site";
import { communityUpdates, getUpcomingSpeedConnect } from "@/data/dashboard";
import {
  getCityIdBySlug,
  getMyRsvpGatherings,
  getPublishedGatherings,
  type GatheringListItem,
} from "@/lib/queries/gatherings";
import { requireOnboarded } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Home",
  robots: { index: false, follow: false },
};

/**
 * Member Dashboard — docs/website/sitemap.md's `/home` ("Member home:
 * this week, Speed Connect booking"). Gatherings and RSVPs are real,
 * fetched from Supabase — Speed Connect and Community Updates remain
 * placeholders (out of scope for this pass; see src/data/dashboard.ts).
 */
export default async function HomePage() {
  const { user } = await requireOnboarded();

  const cityId = await getCityIdBySlug(siteConfig.launchCity.slug);
  const [cityGatherings, myRsvps] = await Promise.all([
    cityId ? getPublishedGatherings(cityId) : Promise.resolve([] as GatheringListItem[]),
    getMyRsvpGatherings(user.id),
  ]);
  // Exclude gatherings already shown below in "My RSVPs" — otherwise a
  // member's own gathering shows up twice on their first dashboard visit,
  // once with no RSVP indicator (looking unclaimed) and once as "going".
  const myRsvpIds = new Set(myRsvps.map((gathering) => gathering.id));
  const discoverable = cityGatherings.filter((gathering) => !myRsvpIds.has(gathering.id));
  const upcoming = discoverable.slice(0, 2);
  const recommended = discoverable.slice(2, 5);
  const speedConnect = getUpcomingSpeedConnect();
  const firstName = user.name?.split(" ")[0];

  return (
    <Section>
      <Container>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-[32px]">Welcome back{firstName ? `, ${firstName}` : ""}</h1>
            <p className="text-ink-muted">
              Here&apos;s what&apos;s happening in {user.city ?? "your city"} this week.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary-light" size="small">
              <Link href="/gatherings/manage">My Gatherings</Link>
            </Button>
            <Button asChild variant="primary" size="small">
              <Link href="/gatherings/create">Create a Gathering</Link>
            </Button>
          </div>
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
              ) : cityGatherings.length > 0 ? (
                <p className="text-ink-muted text-sm">
                  You&apos;re going to everything happening in {user.city ?? "your city"} right now
                  — check back soon for more, or{" "}
                  <Link href="/gatherings/create" className="text-cord-blue font-medium underline">
                    create your own
                  </Link>
                  .
                </p>
              ) : (
                <p className="text-ink-muted text-sm">
                  No upcoming gatherings yet —{" "}
                  <Link href="/gatherings/create" className="text-cord-blue font-medium underline">
                    create the first one
                  </Link>
                  .
                </p>
              )}
            </div>

            {recommended.length > 0 && (
              <div>
                <SectionHeader eyebrow="For You" title="Recommended Gatherings" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recommended.map((gathering) => (
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
              </div>
            )}

            <div>
              <SectionHeader eyebrow="Your Activity" title="My RSVPs" />
              {myRsvps.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myRsvps.map((gathering) => (
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
