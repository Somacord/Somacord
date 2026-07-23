"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

/**
 * Join / create-account form UI only — no Supabase auth call or profile
 * row created yet (see docs/website/sitemap.md — `/onboarding/profile`
 * comes after this step in a later feature pass). Submitting shows a
 * local confirmation without persisting or emailing anything.
 */
export function SignUpForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState("");

  if (submitted) {
    return (
      <div className="rounded-card border-soft-sky bg-soft-sky/40 border px-6 py-8 text-center">
        <h3 className="mb-2 text-xl">You&apos;re on the list{name ? `, ${name}` : ""}</h3>
        <p className="text-ink-muted text-sm">
          Account creation for Somacord is launching soon in {siteConfig.launchCity.name}.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormField label="Name" htmlFor="signup-name">
        <Input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </FormField>
      <FormField label="Email" htmlFor="signup-email">
        <Input id="signup-email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField
        label="City"
        htmlFor="signup-city"
        hint="Somacord is currently available in one city — more are on the way."
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
      <FormField label="Password" htmlFor="signup-password">
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </FormField>
      <Button type="submit" variant="primary" className="w-full">
        Create Account
      </Button>
      <p className="text-ink-muted text-center text-sm">
        Already a member?{" "}
        <Link href="/signin" className="text-cord-blue font-medium underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
