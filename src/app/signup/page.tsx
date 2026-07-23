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
 */
export default function SignUpPage() {
  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Join Somacord</Eyebrow>
          <h1 className="mb-2 text-[30px]">Create your account</h1>
          <p className="text-ink-muted text-sm">
            Your account is free — join gatherings and try Speed Connect right away.{" "}
            {siteConfig.membership.name} ($29/month) is there when you want unlimited access.
          </p>
        </div>
        <Panel>
          <SignUpForm />
        </Panel>
      </Container>
    </Section>
  );
}
