import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GatheringCard } from "@/components/ui/gathering-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getMyGatherings } from "@/lib/queries/gatherings";
import { requireUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Manage Gatherings",
  robots: { index: false, follow: false },
};

/** docs/website/sitemap.md — "/gatherings/manage (Manage gatherings, for members and Community Partners)". */
export default async function ManageGatheringsPage() {
  const { user } = await requireUser();
  const gatherings = await getMyGatherings(user.id);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="My Gatherings"
          title="Gatherings you've created"
          action={
            <Button asChild variant="primary" size="small">
              <Link href="/gatherings/create">Create a Gathering</Link>
            </Button>
          }
        />

        {gatherings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gatherings.map((gathering) => (
              <GatheringCard
                key={gathering.id}
                title={gathering.title}
                description={gathering.shortDescription}
                category={gathering.category}
                imageSrc={gathering.imageSrc}
                imageAlt={gathering.imageAlt}
                meta={[
                  gathering.status === "draft" ? "📝 Draft" : "✅ Published",
                  `🗓 ${gathering.schedule}`,
                ]}
                href={`/gatherings/${gathering.slug}/edit`}
                isExample={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven't created a gathering yet"
            description="Members and Community Partners can both host gatherings on Somacord."
            action={
              <Button asChild variant="primary">
                <Link href="/gatherings/create">Create a Gathering</Link>
              </Button>
            }
          />
        )}
      </Container>
    </Section>
  );
}
