-- Somacord — Organizations (Phase 1 of the marketplace implementation plan)
--
-- Introduces Organizations as first-class entities, replacing the old
-- "partner = a user role + a 1:1 partners row" model. See:
--   - somacord-docs/docs/engineering/marketplace-implementation-plan.md (§2, §3, §9, §10, §12)
--   - somacord-docs/docs/business/launch-strategy.md (concierge-run launch)
--   - BUILD_PLAN.md
--
-- Phase 1 scope only: organizations + organization_managers, the
-- users.role admin value they depend on, and a non-destructive backfill
-- from public.partners. No gatherings/ticketing/Stripe changes, no UI.
-- public.partners is left fully intact — no application code reads or
-- writes it today, so this migration has zero blast radius on existing
-- behavior.

-- ---------------------------------------------------------------------------
-- users.role gains 'admin'
--
-- Required by this migration's own RLS policies below (organizations
-- inserts/updates check for role = 'admin'), so it has to land in the
-- same migration. 'member' and 'community_partner' are unchanged —
-- community_partner stays as an identity marker, not a permission gate.
-- ---------------------------------------------------------------------------
alter table public.users
  drop constraint if exists users_role_check,
  add constraint users_role_check check (role in ('member', 'community_partner', 'admin'));

-- ---------------------------------------------------------------------------
-- organizations
--
-- The business/venue itself (coffee shop, brewery, restaurant, ...) as
-- an entity independent of any one user's login. Concierge-run at
-- launch: Somacord staff (role = 'admin') creates these directly, before
-- the venue necessarily has any Somacord user account at all.
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text not null check (organization_type in (
    'coffee_shop', 'restaurant', 'brewery', 'coworking_space', 'club',
    'hobby_group', 'event_organizer', 'community_organization', 'nonprofit'
  )),
  description text,
  city_id uuid references public.cities (id),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is 'Community Partner organizations — businesses, not members. See docs/business/community-partners.md.';

create trigger set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- organization_managers
--
-- Many-to-many: one organization may have multiple managers, one user
-- may manage multiple organizations. Populated only by admin/service-role
-- in this phase — no self-serve invite flow exists yet.
-- ---------------------------------------------------------------------------
create table public.organization_managers (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null default 'manager' check (role in ('owner', 'manager')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

comment on table public.organization_managers is 'Which users can act for which organizations. No self-serve invite UI yet — rows are created by admin/service-role only in Phase 1.';

create index if not exists organization_managers_user_id_idx on public.organization_managers (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.organization_managers enable row level security;

-- organizations: public read (org profiles are discoverable once there's
-- a page for them); writes restricted to admins for now — no self-serve
-- creation, and no manager can create a second org for themselves here.
create policy "Organizations are publicly readable" on public.organizations
  for select using (true);

create policy "Admins can insert organizations" on public.organizations
  for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Managers or admins can update their organization" on public.organizations
  for update using (
    exists (
      select 1 from public.organization_managers
      where organization_id = organizations.id and user_id = auth.uid()
    )
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- organization_managers: managers can see their own org's manager list;
-- only owners or admins can add/remove managers.
create policy "Managers can view their organization's manager list" on public.organization_managers
  for select using (
    exists (
      select 1 from public.organization_managers om
      where om.organization_id = organization_managers.organization_id and om.user_id = auth.uid()
    )
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Owners or admins can add managers" on public.organization_managers
  for insert with check (
    exists (
      select 1 from public.organization_managers om
      where om.organization_id = organization_managers.organization_id
        and om.user_id = auth.uid() and om.role = 'owner'
    )
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Owners or admins can remove managers" on public.organization_managers
  for delete using (
    exists (
      select 1 from public.organization_managers om
      where om.organization_id = organization_managers.organization_id
        and om.user_id = auth.uid() and om.role = 'owner'
    )
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

grant select, insert, update, delete on public.organizations, public.organization_managers to authenticated;
grant select on public.organizations to anon;
grant all on public.organizations, public.organization_managers to service_role;

-- ---------------------------------------------------------------------------
-- Backfill: partners -> organizations + organization_managers
--
-- Non-destructive: public.partners is not modified or dropped. Looped
-- (not a set-based INSERT...SELECT) so each new organizations.id can be
-- captured unambiguously and paired with the correct source partner row
-- — there's no reliable natural key to join back on otherwise. Partner
-- counts are small (local businesses), so a loop costs nothing here.
--
-- Not idempotent by design — a one-time backfill, not meant to be
-- re-run outside the normal Supabase migration flow (which only applies
-- each migration once).
-- ---------------------------------------------------------------------------
do $$
declare
  partner_row record;
  new_org_id uuid;
begin
  for partner_row in select * from public.partners loop
    insert into public.organizations (name, organization_type, verified, created_at, updated_at)
    values (
      partner_row.organization_name,
      partner_row.organization_type,
      partner_row.verified,
      partner_row.created_at,
      partner_row.created_at
    )
    returning id into new_org_id;

    insert into public.organization_managers (organization_id, user_id, role, created_at)
    values (new_org_id, partner_row.user_id, 'owner', partner_row.created_at);
  end loop;
end $$;
