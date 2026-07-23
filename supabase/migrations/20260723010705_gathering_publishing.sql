-- Somacord — gathering publishing workflow
--
-- Adds a draft/published lifecycle to gatherings so members and Community
-- Partners can create a gathering, preview it, and publish when ready
-- (see docs/product/mvp-requirements.md's "Create gathering" account-flow
-- item). Also adds `slug` for stable public URLs (/gatherings/[slug]),
-- matching the existing route structure, and a public aggregate view for
-- RSVP counts that doesn't expose individual attendee identity.

alter table public.gatherings
  add column if not exists status text not null default 'draft' check (status in ('draft', 'published')),
  add column if not exists slug text;

create unique index if not exists gatherings_slug_key on public.gatherings (slug);
create index if not exists gatherings_status_city_idx on public.gatherings (status, city_id);

comment on column public.gatherings.status is 'draft until the creator publishes it; only published gatherings are publicly visible.';
comment on column public.gatherings.slug is 'Stable slug for /gatherings/[slug], generated at creation time.';

-- Public read access is now gated on publish status; creators can still
-- see (and preview) their own drafts. Replaces the original "Gatherings
-- are publicly readable" (using (true)) policy from initial_schema.sql.
drop policy if exists "Gatherings are publicly readable" on public.gatherings;

create policy "Published gatherings are publicly readable" on public.gatherings
  for select using (status = 'published' or auth.uid() = created_by);

-- ---------------------------------------------------------------------------
-- gathering_rsvp_counts
--
-- Aggregate-only view over `rsvps` so gathering pages can show "N going"
-- without exposing which specific users RSVP'd — `rsvps` itself stays
-- locked down to "view your own rows only" (see initial_schema.sql).
-- Views run with the privileges of their owner for row-security purposes,
-- so this aggregates across all rows even though the underlying table's
-- RLS would otherwise restrict each querying user to their own row.
-- ---------------------------------------------------------------------------
create or replace view public.gathering_rsvp_counts as
select gathering_id, count(*) filter (where status = 'going') as going_count
from public.rsvps
group by gathering_id;

grant select on public.gathering_rsvp_counts to anon, authenticated;
