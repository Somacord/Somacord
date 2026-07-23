import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/sign-in-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="text-[30px]">Sign in to Somacord</h1>
        </div>
        <Panel>
          <SignInForm />
        </Panel>
      </Container>
    </Section>
  );
}
