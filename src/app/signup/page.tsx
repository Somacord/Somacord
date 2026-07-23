import type { Metadata } from "next";

import { SignUpForm } from "@/components/forms/sign-up-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Join Somacord",
};

/**
 * Join / Sign Up — the first step of the account flow in
 * docs/website/sitemap.md (`/signup`). Wired to Supabase Auth (email +
 * password or Google); profile setup happens next at `/onboarding/profile`.
 *
 * `next` (e.g. from a gathering's "Sign Up to RSVP" link) carries the
 * visitor's original destination through signup, email confirmation, and
 * back — see signUpAction and /auth/callback.
 */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Join Somacord</Eyebrow>
          <h1 className="mb-2 text-[30px]">Create your free account</h1>
          <p className="text-ink-muted text-sm">
            Create your free account to join events and start meeting people.{" "}
            {siteConfig.membership.name} is optional and comes later if you love it.
          </p>
        </div>
        <Panel>
          <SignUpForm next={next} />
        </Panel>
      </Container>
    </Section>
  );
}
