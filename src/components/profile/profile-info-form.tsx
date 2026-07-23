"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialProfileActionState, updateProfileInfoAction } from "@/lib/actions/profile";

export interface ProfileInfoFormProps {
  name: string;
  city: string;
}

export function ProfileInfoForm({ name, city }: ProfileInfoFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileInfoAction,
    initialProfileActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Name" htmlFor="profile-name">
        <Input id="profile-name" name="name" defaultValue={name} required />
      </FormField>
      <FormField
        label="City"
        htmlFor="profile-city"
        hint="Somacord is currently available in one city."
      >
        <Input
          id="profile-city"
          name="city"
          defaultValue={city}
          readOnly
          className="bg-soft-sky/40 cursor-not-allowed"
        />
      </FormField>
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
      {state.status !== "idle" && (
        <p
          className={`text-sm ${state.status === "error" ? "text-sand-ink" : "text-community-green"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
