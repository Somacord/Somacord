import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Organization, OrganizationManagerRole, OrganizationType } from "@/types/domain";

interface OrganizationRow {
  id: string;
  name: string;
  organization_type: OrganizationType;
  description: string | null;
  city_id: string | null;
  verified: boolean;
}

const ORGANIZATION_COLUMNS = "id, name, organization_type, description, city_id, verified";

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    organizationType: row.organization_type,
    description: row.description,
    cityId: row.city_id,
    verified: row.verified,
  };
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("organizations")
    .select(ORGANIZATION_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  return data ? mapOrganization(data as OrganizationRow) : null;
}

/** Every organization a user manages — a user may manage more than one. */
export async function getOrganizationsManagedBy(userId: string): Promise<Organization[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("organization_managers")
    .select(`organization:organizations(${ORGANIZATION_COLUMNS})`)
    .eq("user_id", userId);

  return ((data ?? []) as unknown as { organization: OrganizationRow | null }[])
    .map((row) => row.organization)
    .filter((row): row is OrganizationRow => Boolean(row))
    .map(mapOrganization);
}

/**
 * All organizations. For internal/admin use only — this function does not
 * gate access itself (RLS permits public read on `organizations`); callers
 * must call requireAdmin() before using this for anything admin-facing.
 */
export async function getAllOrganizations(): Promise<Organization[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("organizations")
    .select(ORGANIZATION_COLUMNS)
    .order("name", { ascending: true });

  return ((data ?? []) as OrganizationRow[]).map(mapOrganization);
}

/** Null if the user doesn't manage this organization at all. */
export async function getOrganizationManagerRole(
  organizationId: string,
  userId: string,
): Promise<OrganizationManagerRole | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("organization_managers")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .maybeSingle();

  return (data as { role: OrganizationManagerRole } | null)?.role ?? null;
}
