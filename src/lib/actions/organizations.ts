"use server";

import { getOrganizationManagerRole } from "@/lib/queries/organizations";
import { requireAdmin, requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrganizationType } from "@/types/domain";

export interface OrganizationActionResult {
  success: boolean;
  error?: string;
  organizationId?: string;
}

export interface CreateOrganizationInput {
  name: string;
  organizationType: OrganizationType;
  description?: string;
  cityId?: string;
}

/**
 * Admin-only: creates an organization and makes the given user its owner
 * in one step. Concierge model — see docs/business/community-partners.md
 * and docs/business/launch-strategy.md — Somacord staff creates these on
 * a partner's behalf; there is no self-serve org creation.
 *
 * Takes typed parameters rather than FormData: no admin UI calls this
 * yet (deliberately deferred — see BUILD_PLAN.md), so there's no form
 * shape to match. A future admin page can wrap this in a thin
 * useActionState-compatible action if/when it's built.
 */
export async function createOrganizationAction(
  input: CreateOrganizationInput,
  ownerUserId: string,
): Promise<OrganizationActionResult> {
  await requireAdmin();

  const name = input.name.trim();
  if (!name || !input.organizationType) {
    return { success: false, error: "Name and organization type are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      name,
      organization_type: input.organizationType,
      description: input.description?.trim() || null,
      city_id: input.cityId || null,
    })
    .select("id")
    .single();

  if (error || !org) {
    return { success: false, error: "Couldn't create the organization. Please try again." };
  }

  const { error: managerError } = await supabase
    .from("organization_managers")
    .insert({ organization_id: org.id, user_id: ownerUserId, role: "owner" });

  if (managerError) {
    return {
      success: false,
      error: "Organization created, but couldn't assign an owner. Add one manually.",
      organizationId: org.id,
    };
  }

  return { success: true, organizationId: org.id };
}

/** Adds a manager to an organization. Caller must already be that org's owner, or an admin. */
export async function addOrganizationManagerAction(
  organizationId: string,
  newManagerUserId: string,
  role: "owner" | "manager" = "manager",
): Promise<OrganizationActionResult> {
  const { user } = await requireUser();

  if (user.role !== "admin") {
    const callerRole = await getOrganizationManagerRole(organizationId, user.id);
    if (callerRole !== "owner") {
      return { success: false, error: "Only an organization owner or an admin can add managers." };
    }
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("organization_managers")
    .insert({ organization_id: organizationId, user_id: newManagerUserId, role });

  if (error) {
    return {
      success: false,
      error: "Couldn't add that manager — they may already manage this organization.",
    };
  }

  return { success: true };
}
