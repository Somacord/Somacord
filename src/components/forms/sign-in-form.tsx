"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

/**
 * Sign-in form UI only — no Supabase auth call yet (see
 * src/lib/supabase/client.ts for the client this will use once wired
 * up). Submitting shows an honest status message instead of pretending
 * to authenticate.
 */
export function SignInForm() {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
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
      <Button type="submit" variant="primary" className="w-full">
        Sign In
      </Button>
      {submitted && (
        <p className="bg-soft-sky/50 text-ink rounded-[10px] px-4 py-3 text-sm">
          Account sign-in is launching soon. In the meantime,{" "}
          <Link href="/signup" className="text-cord-blue font-medium underline">
            join Somacord
          </Link>{" "}
          to get started.
        </p>
      )}
      <p className="text-ink-muted text-center text-sm">
        New to Somacord?{" "}
        <Link href="/signup" className="text-cord-blue font-medium underline">
          Join Somacord
        </Link>
      </p>
    </form>
  );
}
