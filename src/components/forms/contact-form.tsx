"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * Contact form UI. Client-side only for now — there is no email/backend
 * wiring yet (Resend is configured in src/lib/resend.ts but not called
 * from here). Submitting shows a local confirmation; connect this to a
 * Server Action + Resend in a follow-up backend pass.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <div className="rounded-card border-soft-sky bg-soft-sky/40 border px-6 py-8 text-center">
        <h3 className="mb-2 text-xl">Thanks for reaching out</h3>
        <p className="text-ink-muted text-sm">
          We&apos;ve got your message and will get back to you soon.
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
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" htmlFor="contact-name">
          <Input id="contact-name" name="name" type="text" autoComplete="name" required />
        </FormField>
        <FormField label="Email" htmlFor="contact-email">
          <Input id="contact-email" name="email" type="email" autoComplete="email" required />
        </FormField>
      </div>
      <FormField label="What's this about?" htmlFor="contact-topic">
        <Select id="contact-topic" name="topic" defaultValue="general">
          <option value="general">General question</option>
          <option value="partner">Becoming a Community Partner</option>
          <option value="press">Press</option>
        </Select>
      </FormField>
      <FormField label="Message" htmlFor="contact-message">
        <Textarea id="contact-message" name="message" rows={5} required />
      </FormField>
      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
