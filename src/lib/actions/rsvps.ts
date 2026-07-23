"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function rsvpGoingAction(gatheringId: string, slug: string) {
  const { user } = await requireUser();
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("rsvps")
    .upsert(
      { gathering_id: gatheringId, user_id: user.id, status: "going" },
      { onConflict: "gathering_id,user_id" },
    );

  revalidatePath(`/gatherings/${slug}`);
  revalidatePath("/home");
}

export async function cancelRsvpAction(gatheringId: string, slug: string) {
  const { user } = await requireUser();
  const supabase = await createSupabaseServerClient();

  await supabase.from("rsvps").delete().eq("gathering_id", gatheringId).eq("user_id", user.id);

  revalidatePath(`/gatherings/${slug}`);
  revalidatePath("/home");
}
