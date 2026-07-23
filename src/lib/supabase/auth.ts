import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Availability, NotificationPreferences, UserRole } from "@/types/domain";

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  city: string | null;
  role: UserRole;
}

export interface CurrentProfile {
  interests: string[];
  activities: string[];
  availability: Availability[];
  lookingFor: string | null;
  avatarUrl: string | null;
  notificationPreferences: NotificationPreferences;
  onboardingCompletedAt: string | null;
}

const defaultNotificationPreferences: NotificationPreferences = {
  gatherings: true,
  speedConnect: true,
  communityUpdates: true,
};

/**
 * Reads the current Supabase auth session (if any) plus the matching
 * `public.users` / `public.profiles` rows. Returns null when signed out —
 * callers decide whether that's an error (see `requireUser` below).
 */
export async function getCurrentUser(): Promise<{
  user: CurrentUser;
  profile: CurrentProfile;
} | null> {
  // Treat "Supabase isn't configured yet" the same as "signed out" instead
  // of throwing, so a fresh clone without .env.local still renders
  // (protected pages) as a clean redirect to /signin rather than a 500.
  if (!env.supabase.isConfigured) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return null;
  }

  const [{ data: userRow }, { data: profileRow }] = await Promise.all([
    supabase
      .from("users")
      .select("id, email, name, city, role")
      .eq("id", authData.user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select(
        "interests, activities, availability, looking_for, avatar_url, notification_preferences, onboarding_completed_at",
      )
      .eq("user_id", authData.user.id)
      .maybeSingle(),
  ]);

  const user: CurrentUser = {
    id: authData.user.id,
    email: userRow?.email ?? authData.user.email ?? "",
    name: userRow?.name ?? null,
    city: userRow?.city ?? null,
    role: (userRow?.role as UserRole) ?? "member",
  };

  const profile: CurrentProfile = {
    interests: profileRow?.interests ?? [],
    activities: profileRow?.activities ?? [],
    availability: (profileRow?.availability as Availability[]) ?? [],
    lookingFor: profileRow?.looking_for ?? null,
    avatarUrl: profileRow?.avatar_url ?? null,
    notificationPreferences:
      (profileRow?.notification_preferences as NotificationPreferences) ??
      defaultNotificationPreferences,
    onboardingCompletedAt: profileRow?.onboarding_completed_at ?? null,
  };

  return { user, profile };
}

/** Redirects to /signin if there's no session. Use in Server Components/Actions for protected pages. */
export async function requireUser() {
  const current = await getCurrentUser();
  if (!current) {
    redirect("/signin");
  }
  return current;
}

/** Redirects to /onboarding/profile if the wizard hasn't been completed yet. */
export async function requireOnboarded() {
  const current = await requireUser();
  if (!current.profile.onboardingCompletedAt) {
    redirect("/onboarding/profile");
  }
  return current;
}
