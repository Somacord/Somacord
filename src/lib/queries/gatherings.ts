import type { GatheringCategoryLabel } from "@/components/ui/badge";
import { photography } from "@/config/media";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatGatheringSchedule, truncate } from "@/lib/utils";
import type { GatheringStatus } from "@/types/domain";

/** Minimal shape GatheringCard/GatheringsBrowser need to render a tile. */
export interface GatheringSummary {
  id: string;
  title: string;
  category: GatheringCategoryLabel;
  shortDescription: string;
  imageSrc: string;
  imageAlt: string;
  location: string;
  schedule: string;
  href: string;
}

/** Full shape for a single gathering's detail/edit/manage views. */
export interface GatheringListItem extends GatheringSummary {
  slug: string;
  description: string;
  groupSize: string;
  hostedBy: string;
  status: GatheringStatus;
  createdBy: string;
  cityId: string;
}

interface GatheringRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "community" | "partner";
  location: string;
  starts_at: string | null;
  capacity: number | null;
  status: GatheringStatus;
  created_by: string;
  city_id: string;
}

const GATHERING_COLUMNS =
  "id, slug, title, description, category, location, starts_at, capacity, status, created_by, city_id";

function mapGathering(row: GatheringRow): GatheringListItem {
  const isPartner = row.category === "partner";
  const categoryLabel: GatheringCategoryLabel = isPartner ? "Partner" : "Community";

  return {
    id: row.id,
    slug: row.slug,
    href: `/gatherings/${row.slug}`,
    title: row.title,
    category: categoryLabel,
    shortDescription: truncate(row.description, 140),
    description: row.description,
    imageSrc: photography.coffeeGathering.src,
    imageAlt: `${row.title} — gathering photo`,
    location: row.location,
    schedule: formatGatheringSchedule(row.starts_at),
    groupSize: row.capacity ? `Up to ${row.capacity} people` : "Open group size",
    hostedBy: isPartner ? "Community Partner" : "Community member",
    status: row.status,
    createdBy: row.created_by,
    cityId: row.city_id,
  };
}

/** Resolves a city slug (e.g. "salt-lake-city") to its `cities.id`. */
export async function getCityIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("cities").select("id").eq("slug", slug).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

export async function getPublishedGatherings(
  cityId: string,
  take?: number,
): Promise<GatheringListItem[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("gatherings")
    .select(GATHERING_COLUMNS)
    .eq("status", "published")
    .eq("city_id", cityId)
    .order("starts_at", { ascending: true });

  if (take) {
    query = query.limit(take);
  }

  const { data } = await query;
  return ((data ?? []) as GatheringRow[]).map(mapGathering);
}

/**
 * Fetches a gathering by its public slug. Returns null if it doesn't exist,
 * or if it's unpublished and the viewer isn't its creator — callers should
 * treat both cases identically (404), never distinguish them in the UI.
 */
export async function getGatheringBySlug(
  slug: string,
  viewerId: string | null,
): Promise<GatheringListItem | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gatherings")
    .select(GATHERING_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  const row = data as GatheringRow;
  if (row.status !== "published" && row.created_by !== viewerId) return null;

  return mapGathering(row);
}

export async function getRelatedGatherings(
  currentId: string,
  cityId: string,
  take = 3,
): Promise<GatheringListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gatherings")
    .select(GATHERING_COLUMNS)
    .eq("status", "published")
    .eq("city_id", cityId)
    .neq("id", currentId)
    .order("starts_at", { ascending: true })
    .limit(take);

  return ((data ?? []) as GatheringRow[]).map(mapGathering);
}

/** Every gathering a user created, draft or published — for /gatherings/manage. */
export async function getMyGatherings(userId: string): Promise<GatheringListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gatherings")
    .select(GATHERING_COLUMNS)
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  return ((data ?? []) as GatheringRow[]).map(mapGathering);
}

export interface GatheringEditableFields {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  startsAt: string | null;
  capacity: number | null;
  status: GatheringStatus;
}

/** Raw (unformatted) fields for the edit form — scoped to the owner only. */
export async function getGatheringForEdit(
  slug: string,
  userId: string,
): Promise<GatheringEditableFields | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gatherings")
    .select("id, slug, title, description, location, starts_at, capacity, status")
    .eq("slug", slug)
    .eq("created_by", userId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    location: data.location,
    startsAt: data.starts_at,
    capacity: data.capacity,
    status: data.status,
  };
}

/** Aggregate-only RSVP count — never exposes which users RSVP'd. */
export async function getGatheringRsvpCount(gatheringId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gathering_rsvp_counts")
    .select("going_count")
    .eq("gathering_id", gatheringId)
    .maybeSingle();

  return (data as { going_count: number } | null)?.going_count ?? 0;
}

export async function getUserRsvpStatus(gatheringId: string, userId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("rsvps")
    .select("status")
    .eq("gathering_id", gatheringId)
    .eq("user_id", userId)
    .eq("status", "going")
    .maybeSingle();

  return Boolean(data);
}

/** Gatherings the user is currently going to — for the dashboard's "My RSVPs". */
export async function getMyRsvpGatherings(userId: string): Promise<GatheringListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("rsvps")
    .select(`gathering:gatherings(${GATHERING_COLUMNS})`)
    .eq("user_id", userId)
    .eq("status", "going");

  return ((data ?? []) as unknown as { gathering: GatheringRow | null }[])
    .map((row) => row.gathering)
    .filter((row): row is GatheringRow => Boolean(row))
    .map(mapGathering);
}
