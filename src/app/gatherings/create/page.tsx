import type { Metadata } from "next";

import { GatheringForm } from "@/components/gatherings/gathering-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/ui/section-header";
import { createGatheringAction } from "@/lib/actions/gatherings";
import { requireUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Create a Gathering",
  robots: { index: false, follow: false },
};

/**
 * Any signed-in member or Community Partner can create a gathering — see
 * docs/product/mvp-requirements.md's account-flow "Create gathering" and
 * docs/business/community-partners.md. Not partner-exclusive.
 */
export default async function CreateGatheringPage() {
  await requireUser();

  return (
    <Section>
      <Container className="max-w-xl">
        <SectionHeader
          eyebrow="New Gathering"
          title="Create a gathering"
          subhead="It starts as a draft — you can preview it and publish when you're ready."
        />
        <GatheringForm
          action={createGatheringAction}
          submitLabel="Create Draft"
          pendingLabel="Creating…"
        />
      </Container>
    </Section>
  );
}
