"use client";

import * as React from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FilterPill } from "@/components/ui/filter-pill";
import { interestOptions } from "@/data/onboarding";
import { initialProfileActionState, updateInterestsAction } from "@/lib/actions/profile";

export interface InterestsEditorProps {
  initialInterests: string[];
}

export function InterestsEditor({ initialInterests }: InterestsEditorProps) {
  const [interests, setInterests] = React.useState(initialInterests);
  const [state, formAction, pending] = useActionState(
    updateInterestsAction,
    initialProfileActionState,
  );

  function toggle(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }

  return (
    <form action={formAction}>
      {interests.map((interest) => (
        <input key={interest} type="hidden" name="interests" value={interest} />
      ))}
      <div className="mb-5 flex flex-wrap gap-2.5">
        {interestOptions.map((interest) => (
          <FilterPill
            key={interest}
            active={interests.includes(interest)}
            onClick={() => toggle(interest)}
          >
            {interest}
          </FilterPill>
        ))}
      </div>
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Save interests"}
      </Button>
      {state.status !== "idle" && (
        <p
          className={`mt-3 text-sm ${state.status === "error" ? "text-sand-ink" : "text-community-green"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
