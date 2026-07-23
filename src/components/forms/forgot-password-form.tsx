"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction, initialAuthActionState } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialAuthActionState);

  if (state.status === "success") {
    return (
      <div className="rounded-card border-soft-sky bg-soft-sky/40 border px-6 py-8 text-center">
        <h3 className="mb-2 text-xl">Check your email</h3>
        <p className="text-ink-muted text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Email" htmlFor="forgot-email">
        <Input id="forgot-email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      {state.status === "error" && (
        <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
          {state.message}
        </p>
      )}
      <p className="text-ink-muted text-center text-sm">
        <Link href="/signin" className="text-cord-blue font-medium underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
