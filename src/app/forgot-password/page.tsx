import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Account recovery</Eyebrow>
          <h1 className="text-[30px]">Reset your password</h1>
          <p className="text-ink-muted mt-2 text-sm">
            We&apos;ll email you a link to set a new one.
          </p>
        </div>
        <Panel>
          <ForgotPasswordForm />
        </Panel>
      </Container>
    </Section>
  );
}
