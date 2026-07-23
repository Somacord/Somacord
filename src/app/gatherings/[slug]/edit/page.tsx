import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GatheringForm } from "@/components/gatherings/gathering-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { publishGatheringAction, updateGatheringAction } from "@/lib/actions/gatherings";
import { getGatheringForEdit } from "@/lib/queries/gatherings";
import { requireUser } from "@/lib/supabase/auth";
import { toDatetimeLocalValue } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Edit Gathering",
  robots: { index: false, follow: false },
};

export default async function EditGatheringPage({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = await requireUser();
  const { slug } = await params;
  const gathering = await getGatheringForEdit(slug, user.id);

  if (!gathering) {
    notFound();
  }

  const isDraft = gathering.status === "draft";

  return (
    <Section>
      <Container className="max-w-xl">
        <SectionHeader
          eyebrow={isDraft ? "Draft" : "Published"}
          title={gathering.title}
          subhead={
            isDraft
              ? "Only you can see this until you publish it."
              : "This gathering is live and publicly visible."
          }
        />

        {isDraft && (
          <form action={publishGatheringAction.bind(null, gathering.id)} className="mb-8">
            <Button type="submit" variant="primary">
              Publish Gathering
            </Button>
          </form>
        )}

        <GatheringForm
          action={updateGatheringAction.bind(null, gathering.id)}
          defaultValues={{
            title: gathering.title,
            description: gathering.description,
            location: gathering.location,
            startsAt: toDatetimeLocalValue(gathering.startsAt),
            capacity: gathering.capacity,
          }}
          submitLabel="Save Changes"
          pendingLabel="Saving…"
        />
      </Container>
    </Section>
  );
}
