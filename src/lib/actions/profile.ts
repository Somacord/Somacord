"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ProfileActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialProfileActionState: ProfileActionState = { status: "idle" };

export async function updateProfileInfoAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { user } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Name can't be empty." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ name, city }).eq("id", user.id);

  if (error) {
    return { status: "error", message: "Couldn't save your changes. Please try again." };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Profile updated." };
}

export async function updateAvatarAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { user } = await requireUser();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl || null })
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: "Couldn't save your photo. Please try again." };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Photo updated." };
}

export async function updateInterestsAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { user } = await requireUser();
  const interests = formData.getAll("interests").map(String);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").update({ interests }).eq("user_id", user.id);

  if (error) {
    return { status: "error", message: "Couldn't save your interests. Please try again." };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Interests updated." };
}

export async function updateNotificationPreferencesAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { user } = await requireUser();

  const preferences = {
    gatherings: formData.get("gatherings") === "on",
    speedConnect: formData.get("speedConnect") === "on",
    communityUpdates: formData.get("communityUpdates") === "on",
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ notification_preferences: preferences })
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: "Couldn't save your notification settings. Please try again.",
    };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Notification settings updated." };
}
