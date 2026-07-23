import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Account recovery</Eyebrow>
          <h1 className="text-[30px]">Choose a new password</h1>
        </div>
        <Panel>
          <ResetPasswordForm />
        </Panel>
      </Container>
    </Section>
  );
}
