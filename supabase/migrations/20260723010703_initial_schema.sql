-- Somacord — initial schema
--
-- Source of truth: /somacord-docs/docs/engineering/database-schema.md
--
-- This migration creates every core entity from the approved schema
-- (users, profiles, cities, gatherings, rsvps, memberships, partners,
-- speed_connect_sessions), even though most of the application logic on
-- top of gatherings/memberships/partners/speed_connect_sessions is not
-- built yet (see the auth + onboarding + member-dashboard milestone this
-- migration ships with). Laying the full schema now avoids churn later.
--
-- Two intentional additions beyond the literal schema doc, needed for
-- the onboarding flow this milestone requires:
--   - profiles.availability text[]      (onboarding step: Availability)
--   - profiles.onboarding_completed_at  (gates access to /home)
--   - profiles.notification_preferences (Profile > Notification settings)
-- These are additive only — nothing documented has been changed or removed.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- users
--
-- Mirrors auth.users (id, email) plus the app-specific fields from the
-- schema doc (name, city, role). Populated by the handle_new_user trigger
-- below so every signup path (email/password or Google) gets a row here.
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  city text,
  role text not null default 'member' check (role in ('member', 'community_partner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'App-level user record. One row per auth.users row, created by handle_new_user().';

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  interests text[] not null default '{}',
  activities text[] not null default '{}',
  -- Onboarding "Availability" step (Weekday Evenings / Weekends / Flexible).
  -- Not in the literal schema doc; additive, same array-of-text shape as
  -- interests/activities.
  availability text[] not null default '{}',
  -- Free text, never appearance-based — see docs/product/vision.md principle 2.
  looking_for text,
  avatar_url text,
  -- Simple boolean toggles for the Profile > Notification settings section.
  -- Keys are camelCase to match src/types/domain.ts's NotificationPreferences
  -- one-to-one (no snake_case/camelCase mapping needed when reading this back).
  notification_preferences jsonb not null default '{"gatherings": true, "speedConnect": true, "communityUpdates": true}'::jsonb,
  -- Gates /home and /profile until the onboarding wizard is finished.
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profile setup + onboarding state. One row per user, created by handle_new_user().';

-- ---------------------------------------------------------------------------
-- cities
-- ---------------------------------------------------------------------------
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  state text not null,
  launch_status text not null default 'example' check (launch_status in ('example', 'live')),
  created_at timestamptz not null default now()
);

comment on table public.cities is 'Launch markets. Salt Lake City is the only MVP launch city — see docs/business/launch-strategy.md.';

insert into public.cities (name, slug, state, launch_status)
values ('Salt Lake City', 'salt-lake-city', 'UT', 'live')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- gatherings
-- ---------------------------------------------------------------------------
create table if not exists public.gatherings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('community', 'partner')),
  created_by uuid not null references public.users (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete restrict,
  location text,
  starts_at timestamptz,
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gatherings_city_id_idx on public.gatherings (city_id);
create index if not exists gatherings_created_by_idx on public.gatherings (created_by);

comment on table public.gatherings is 'Community/partner gatherings. Creation UI is not built yet — this table exists so the schema is ready.';

-- ---------------------------------------------------------------------------
-- rsvps
-- ---------------------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'going' check (status in ('going', 'interested', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (gathering_id, user_id)
);

create index if not exists rsvps_user_id_idx on public.rsvps (user_id);
create index if not exists rsvps_gathering_id_idx on public.rsvps (gathering_id);

-- ---------------------------------------------------------------------------
-- memberships
--
-- Somacord Membership — Monthly ($39), Quarterly ($99), or Yearly ($349).
-- See docs/business/pricing.md. Stripe checkout is explicitly out of scope
-- for this milestone; this table exists so the schema is ready.
-- ---------------------------------------------------------------------------
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'canceled')),
  plan text not null check (plan in ('monthly', 'quarterly', 'yearly')),
  price numeric(10, 2) not null,
  stripe_subscription_id text,
  started_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists memberships_user_id_idx on public.memberships (user_id);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------
create table if not exists public.partners (
  user_id uuid primary key references public.users (id) on delete cascade,
  organization_name text not null,
  organization_type text not null check (
    organization_type in ('coffee_shop', 'restaurant', 'club', 'hobby_group', 'event_organizer', 'community_organization')
  ),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- speed_connect_sessions
--
-- `provider` is always 'meetaway' internally and must never be surfaced as
-- a customer-facing name — see docs/brand/experience-language.md.
-- ---------------------------------------------------------------------------
create table if not exists public.speed_connect_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'booked' check (status in ('booked', 'completed', 'no_show')),
  provider text not null default 'meetaway',
  created_at timestamptz not null default now()
);

create index if not exists speed_connect_sessions_user_id_idx on public.speed_connect_sessions (user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.gatherings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user — populates public.users + public.profiles for every new
-- auth.users row (email/password signup or Google OAuth alike).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    'member'
  )
  on conflict (id) do nothing;

  insert into public.profiles (user_id, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'avatar_url')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.gatherings enable row level security;
alter table public.rsvps enable row level security;
alter table public.memberships enable row level security;
alter table public.partners enable row level security;
alter table public.speed_connect_sessions enable row level security;

-- users: read/update your own row only.
create policy "Users can view their own row" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own row" on public.users
  for update using (auth.uid() = id);

-- profiles: read/update/insert your own row only.
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

-- cities: public read (needed for city pages / city picker), no public write.
create policy "Cities are publicly readable" on public.cities
  for select using (true);

-- gatherings: public read (needed for public gatherings pages); only the
-- creator can manage their own gathering. No gathering-creation UI exists
-- yet, but the policy is ready for when it does.
create policy "Gatherings are publicly readable" on public.gatherings
  for select using (true);

create policy "Creators can insert their own gatherings" on public.gatherings
  for insert with check (auth.uid() = created_by);

create policy "Creators can update their own gatherings" on public.gatherings
  for update using (auth.uid() = created_by);

create policy "Creators can delete their own gatherings" on public.gatherings
  for delete using (auth.uid() = created_by);

-- rsvps: users manage their own RSVPs only.
create policy "Users can view their own rsvps" on public.rsvps
  for select using (auth.uid() = user_id);

create policy "Users can create their own rsvps" on public.rsvps
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own rsvps" on public.rsvps
  for update using (auth.uid() = user_id);

create policy "Users can delete their own rsvps" on public.rsvps
  for delete using (auth.uid() = user_id);

-- memberships: read/update your own row only. Written by a future Stripe
-- webhook handler using the service-role client (which bypasses RLS).
create policy "Users can view their own membership" on public.memberships
  for select using (auth.uid() = user_id);

-- partners: read/update/insert your own row only.
create policy "Users can view their own partner row" on public.partners
  for select using (auth.uid() = user_id);

create policy "Users can insert their own partner row" on public.partners
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own partner row" on public.partners
  for update using (auth.uid() = user_id);

-- speed_connect_sessions: users manage their own sessions only.
create policy "Users can view their own speed connect sessions" on public.speed_connect_sessions
  for select using (auth.uid() = user_id);

create policy "Users can create their own speed connect sessions" on public.speed_connect_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own speed connect sessions" on public.speed_connect_sessions
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants
--
-- Recent Supabase projects do not auto-expose new public-schema tables to
-- the Data API roles, so explicit grants are required. RLS policies above
-- remain the real access control; these grants just allow the roles to
-- attempt the operation at all.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on
  public.users,
  public.profiles,
  public.cities,
  public.gatherings,
  public.rsvps,
  public.memberships,
  public.partners,
  public.speed_connect_sessions
to authenticated;

grant select on
  public.cities,
  public.gatherings
to anon;

grant all on
  public.users,
  public.profiles,
  public.cities,
  public.gatherings,
  public.rsvps,
  public.memberships,
  public.partners,
  public.speed_connect_sessions
to service_role;
