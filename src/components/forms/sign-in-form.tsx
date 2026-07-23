"use client";

import Link from "next/link";
import * as React from "react";
import { useActionState } from "react";

import { GoogleAuthButton } from "@/components/forms/google-auth-button";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialAuthActionState } from "@/lib/actions/auth-state";
import { signInAction } from "@/lib/actions/auth";

export interface SignInFormProps {
  /** Return-to path after a successful sign-in (e.g. from middleware's ?next=). */
  next?: string;
}

/** Sign-in form — wired to Supabase Auth (email/password + Google). */
export function SignInForm({ next }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, initialAuthActionState);

  return (
    <div className="space-y-5">
      <GoogleAuthButton next={next} />

      <div className="text-ink-muted flex items-center gap-3 text-xs">
        <span className="bg-soft-sky h-px flex-1" />
        or sign in with email
        <span className="bg-soft-sky h-px flex-1" />
      </div>

      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}
        <FormField label="Email" htmlFor="signin-email">
          <Input id="signin-email" name="email" type="email" autoComplete="email" required />
        </FormField>
        <FormField label="Password" htmlFor="signin-password">
          <Input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </FormField>
        <div className="text-right">
          <Link href="/forgot-password" className="text-cord-blue text-xs font-medium underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign In"}
        </Button>
        {state.status === "error" && (
          <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
            {state.message}
          </p>
        )}
      </form>

      <p className="text-ink-muted text-center text-sm">
        New to Somacord?{" "}
        <Link href="/signup" className="text-cord-blue font-medium underline">
          Join Somacord
        </Link>
      </p>
    </div>
  );
}
