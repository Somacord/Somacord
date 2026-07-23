"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { updateNotificationPreferencesAction } from "@/lib/actions/profile";
import { initialProfileActionState } from "@/lib/actions/profile-state";
import type { NotificationPreferences } from "@/types/domain";

export interface NotificationSettingsFormProps {
  preferences: NotificationPreferences;
}

export function NotificationSettingsForm({ preferences }: NotificationSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateNotificationPreferencesAction,
    initialProfileActionState,
  );

  return (
    <form action={formAction}>
      <div className="divide-soft-sky divide-y">
        <ToggleSwitch
          id="notif-gatherings"
          name="gatherings"
          label="Gathering updates"
          description="New gatherings near you and RSVP reminders."
          defaultChecked={preferences.gatherings}
        />
        <ToggleSwitch
          id="notif-speed-connect"
          name="speedConnect"
          label="Speed Connect reminders"
          description="Upcoming session reminders."
          defaultChecked={preferences.speedConnect}
        />
        <ToggleSwitch
          id="notif-community-updates"
          name="communityUpdates"
          label="Community updates"
          description="News from the Somacord community."
          defaultChecked={preferences.communityUpdates}
        />
      </div>
      <Button type="submit" variant="primary" className="mt-5" disabled={pending}>
        {pending ? "Saving…" : "Save preferences"}
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
