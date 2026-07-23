"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type GatheringActionState,
  initialGatheringActionState,
} from "@/lib/actions/gathering-state";

export interface GatheringFormValues {
  title: string;
  description: string;
  location: string;
  /** yyyy-MM-ddTHH:mm — see toDatetimeLocalValue() in lib/utils.ts */
  startsAt: string;
  capacity: number | null;
}

export interface GatheringFormProps {
  action: (state: GatheringActionState, formData: FormData) => Promise<GatheringActionState>;
  defaultValues?: GatheringFormValues;
  submitLabel: string;
  pendingLabel: string;
}

/** Shared create/edit form for gatherings — see /gatherings/create and /gatherings/[slug]/edit. */
export function GatheringForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
}: GatheringFormProps) {
  const [state, formAction, pending] = useActionState(action, initialGatheringActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Title" htmlFor="gathering-title">
        <Input
          id="gathering-title"
          name="title"
          type="text"
          defaultValue={defaultValues?.title}
          required
        />
      </FormField>
      <FormField label="Description" htmlFor="gathering-description">
        <Textarea
          id="gathering-description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          required
        />
      </FormField>
      <FormField label="Location" htmlFor="gathering-location">
        <Input
          id="gathering-location"
          name="location"
          type="text"
          defaultValue={defaultValues?.location}
          required
        />
      </FormField>
      <FormField label="Date & time" htmlFor="gathering-starts-at">
        <Input
          id="gathering-starts-at"
          name="startsAt"
          type="datetime-local"
          defaultValue={defaultValues?.startsAt}
          required
        />
      </FormField>
      <FormField
        label="Capacity"
        htmlFor="gathering-capacity"
        hint="Optional — leave blank for an open group size."
      >
        <Input
          id="gathering-capacity"
          name="capacity"
          type="number"
          min={1}
          defaultValue={defaultValues?.capacity ?? undefined}
        />
      </FormField>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </Button>

      {state.status === "error" && (
        <p className="bg-warm-sand text-sand-ink rounded-[10px] px-4 py-3 text-sm">
          {state.message}
        </p>
      )}
      {state.status === "idle" && state.message && (
        <p className="text-community-green text-sm font-medium">{state.message}</p>
      )}
    </form>
  );
}
