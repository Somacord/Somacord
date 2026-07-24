"use client";

import Link from "next/link";
import { useActionState } from "react";

import { GoogleAuthButton } from "@/components/forms/google-auth-button";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { initialAuthActionState } from "@/lib/actions/auth-state";
import { signUpAction } from "@/lib/actions/auth";

export interface SignUpFormProps {
  /** Return-to path after signup completes (e.g. a gathering someone was trying to RSVP to). */
  next?: string;
}

/** Join / create-account form — wired to Supabase Auth (email/password + Google). */
export function SignUpForm({ next }: SignUpFormProps) {
  const [state, formAction, pending] = useActionState(signUpAction, initialAuthActionState);

  if (state.status === "success") {
    return (
      <div className="rounded-card border-soft-sky bg-soft-sky/40 border px-6 py-8 text-center">
        <h3 className="mb-2 text-xl">Check your email</h3>
        <p className="text-ink-muted text-sm">{state.message}</p>
        <p className="text-ink-muted mt-4 text-sm">
          You&apos;re one of the first to join Somacord in {siteConfig.launchCity.name}. We&apos;ll
          email you the moment the first event is announced.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleAuthButton next={next} />

      <div className="text-ink-muted flex items-center gap-3 text-xs">
        <span className="bg-soft-sky h-px flex-1" />
        or join with email
        <span className="bg-soft-sky h-px flex-1" />
      </div>

      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}
        <FormField label="Name" htmlFor="signup-name">
          <Input id="signup-name" name="name" type="text" autoComplete="name" required />
        </FormField>
        <FormField label="Email" htmlFor="signup-email">
          <Input id="signup-email" name="email" type="email" autoComplete="email" required />
        </FormField>
        <FormField
          label="City"
          htmlFor="signup-city"
          hint="Somacord is currently available in one city. More are on the way."
        >
          <Input
            id="signup-city"
            name="city"
            type="text"
            value={siteConfig.launchCity.name}
            disabled
            readOnly
          />
        </FormField>
        <FormField label="Password" htmlFor="signup-password" hint="At least 8 characters.">
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </FormField>
        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create Account"}
        </Button>
        {state.status === "error" && (
          <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
            {state.message}
          </p>
        )}
      </form>

      <p className="text-ink-muted text-center text-sm">
        Already have an account?{" "}
        <Link
          href={next ? `/signin?next=${encodeURIComponent(next)}` : "/signin"}
          className="text-cord-blue font-medium underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
