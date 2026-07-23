import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/sign-in-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <Section tone="sky">
      <Container className="max-w-md">
        <div className="mb-8 text-center">
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="text-[30px]">Sign in to Somacord</h1>
        </div>
        {error && (
          <p className="bg-warm-sand text-sand-ink mb-6 rounded-[10px] px-4 py-3 text-center text-sm">
            {error === "google"
              ? "Google sign-in didn't go through. Please try again."
              : "That link didn't work — please sign in again."}
          </p>
        )}
        <Panel>
          <SignInForm next={next} />
        </Panel>
      </Container>
    </Section>
  );
}
