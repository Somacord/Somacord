"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialAuthActionState } from "@/lib/actions/auth-state";
import { resetPasswordAction } from "@/lib/actions/auth";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="New password" htmlFor="reset-password" hint="At least 8 characters.">
        <Input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </FormField>
      <FormField label="Confirm new password" htmlFor="reset-confirm-password">
        <Input
          id="reset-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </FormField>
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Set new password"}
      </Button>
      {state.status === "error" && (
        <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}
