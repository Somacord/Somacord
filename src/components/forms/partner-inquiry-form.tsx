"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialPartnerInquiryActionState } from "@/lib/actions/partner-inquiry-state";
import { submitPartnerInquiryAction } from "@/lib/actions/partner-inquiries";

/**
 * Community Partner inquiry form — sends an email to the team, nothing
 * more. No account is created and no organization exists until staff
 * follow up manually. See submitPartnerInquiryAction.
 */
export function PartnerInquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitPartnerInquiryAction,
    initialPartnerInquiryActionState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-card border-soft-sky bg-soft-sky/10 border px-6 py-8 text-center">
        <h3 className="mb-2 text-xl text-white">Thanks for reaching out</h3>
        <p className="text-sm text-white/85">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="partner-inquiry-name">
          <Input id="partner-inquiry-name" name="name" type="text" autoComplete="name" required />
        </FormField>
        <FormField label="Email" htmlFor="partner-inquiry-email">
          <Input
            id="partner-inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </FormField>
      </div>
      <FormField label="Organization name" htmlFor="partner-inquiry-org">
        <Input id="partner-inquiry-org" name="organizationName" type="text" required />
      </FormField>
      <FormField
        label="Tell us about your organization"
        htmlFor="partner-inquiry-message"
        hint="Optional — what you do, and what kind of gathering you'd want to host."
      >
        <Textarea id="partner-inquiry-message" name="message" rows={4} />
      </FormField>
      <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "Send Inquiry"}
      </Button>
      {state.status === "error" && (
        <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}
