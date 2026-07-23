import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Panel } from "@/components/ui/panel";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { siteConfig } from "@/config/site";
import { requireUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

/**
 * Onboarding — docs/website/sitemap.md's `/onboarding/profile` (profile
 * setup: name, city, interests, activities), implemented as a 7-step
 * wizard per this milestone's brief. Same route as the approved sitemap
 * entry; the wizard steps are internal client state, not separate URLs.
 */
export default async function OnboardingProfilePage() {
  const { user, profile } = await requireUser();

  if (profile.onboardingCompletedAt) {
    redirect("/home");
  }

  return (
    <Section tone="sky">
      <Container className="max-w-lg">
        <Panel>
          <OnboardingWizard userId={user.id} defaultCity={siteConfig.launchCity.name} />
        </Panel>
      </Container>
    </Section>
  );
}
