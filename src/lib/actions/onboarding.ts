"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/auth";

export interface OnboardingActionState {
  status: "idle" | "error";
  message?: string;
}

export const initialOnboardingActionState: OnboardingActionState = { status: "idle" };

/**
 * Submitted once, from the wizard's final "Finish" step — see
 * src/components/onboarding/onboarding-wizard.tsx. Writes the whole
 * onboarding payload in one go and marks onboarding complete.
 */
export async function completeOnboardingAction(
  _prevState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const { user } = await requireUser();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const interests = formData.getAll("interests").map(String);
  const availability = formData.getAll("availability").map(String);
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();

  if (!firstName || !lastName) {
    return { status: "error", message: "Please enter your first and last name." };
  }
  if (!city) {
    return { status: "error", message: "Please choose your city." };
  }

  const supabase = await createSupabaseServerClient();
  const name = `${firstName} ${lastName}`.trim();

  const { error: userError } = await supabase
    .from("users")
    .update({ name, city })
    .eq("id", user.id);
  if (userError) {
    return { status: "error", message: "Couldn't save your name and city. Please try again." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      interests,
      availability,
      avatar_url: avatarUrl || null,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (profileError) {
    return {
      status: "error",
      message: "Couldn't save your interests and availability. Please try again.",
    };
  }

  redirect("/home");
}
