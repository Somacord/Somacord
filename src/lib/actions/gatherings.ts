"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { GatheringActionState } from "@/lib/actions/gathering-state";
import { siteConfig } from "@/config/site";
import { getCityIdBySlug } from "@/lib/queries/gatherings";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateGatheringSlug } from "@/lib/utils";

interface ParsedGatheringForm {
  title: string;
  description: string;
  location: string;
  startsAt: string;
  capacity: number | null;
}

function parseGatheringForm(formData: FormData): ParsedGatheringForm {
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    startsAt: String(formData.get("startsAt") ?? "").trim(),
    capacity: capacityRaw ? Number(capacityRaw) : null,
  };
}

function validateGatheringForm(fields: ParsedGatheringForm): string | null {
  if (!fields.title || !fields.description || !fields.location || !fields.startsAt) {
    return "Please fill in the title, description, location, and date & time.";
  }
  if (Number.isNaN(new Date(fields.startsAt).getTime())) {
    return "Please enter a valid date and time.";
  }
  if (fields.capacity !== null && (!Number.isInteger(fields.capacity) || fields.capacity < 1)) {
    return "Capacity must be a positive whole number.";
  }
  return null;
}

/**
 * Any signed-in member or Community Partner can create a gathering — see
 * docs/business/community-partners.md ("Members create community;
 * Community Partners bring community"). `category` reflects the
 * creator's identity, not a permission the creator was granted.
 */
export async function createGatheringAction(
  _prevState: GatheringActionState,
  formData: FormData,
): Promise<GatheringActionState> {
  const { user } = await requireUser();
  const fields = parseGatheringForm(formData);
  const validationError = validateGatheringForm(fields);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const cityId = await getCityIdBySlug(siteConfig.launchCity.slug);
  if (!cityId) {
    return { status: "error", message: "Couldn't find the launch city. Please try again." };
  }

  const category = user.role === "community_partner" ? "partner" : "community";
  const slug = generateGatheringSlug(fields.title);

  const supabase = await createSupabaseServerClient();
  const { data: gathering, error } = await supabase
    .from("gatherings")
    .insert({
      title: fields.title,
      description: fields.description,
      category,
      created_by: user.id,
      city_id: cityId,
      location: fields.location,
      starts_at: new Date(fields.startsAt).toISOString(),
      capacity: fields.capacity,
      slug,
      status: "draft",
    })
    .select("slug")
    .single();

  if (error || !gathering) {
    return { status: "error", message: "Couldn't create your gathering. Please try again." };
  }

  redirect(`/gatherings/${gathering.slug}/edit`);
}

export async function updateGatheringAction(
  gatheringId: string,
  _prevState: GatheringActionState,
  formData: FormData,
): Promise<GatheringActionState> {
  const { user } = await requireUser();
  const fields = parseGatheringForm(formData);
  const validationError = validateGatheringForm(fields);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("gatherings")
    .select("slug")
    .eq("id", gatheringId)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!existing) {
    return { status: "error", message: "Gathering not found." };
  }

  const { error } = await supabase
    .from("gatherings")
    .update({
      title: fields.title,
      description: fields.description,
      location: fields.location,
      starts_at: new Date(fields.startsAt).toISOString(),
      capacity: fields.capacity,
    })
    .eq("id", gatheringId);

  if (error) {
    return { status: "error", message: "Couldn't save your changes. Please try again." };
  }

  revalidatePath(`/gatherings/${existing.slug}`);
  revalidatePath(`/gatherings/${existing.slug}/edit`);
  return { status: "idle", message: "Saved." };
}

export async function publishGatheringAction(gatheringId: string) {
  const { user } = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("gatherings")
    .select("slug")
    .eq("id", gatheringId)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!existing) {
    redirect("/gatherings/manage");
  }

  await supabase.from("gatherings").update({ status: "published" }).eq("id", gatheringId);

  revalidatePath("/gatherings");
  revalidatePath("/gatherings/manage");
  revalidatePath(`/gatherings/${existing.slug}`);
  redirect(`/gatherings/${existing.slug}`);
}
