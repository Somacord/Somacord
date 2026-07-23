# Somacord — Phase 1 Build Plan: Organizations

**Status:** Planning only. No code, migrations, or schema have been changed to produce this document. Requires explicit approval before implementation starts.

Source: [`somacord-docs/docs/engineering/marketplace-implementation-plan.md`](somacord-docs/docs/engineering/marketplace-implementation-plan.md) §0 (architecture review), §2, §3, §9, §10, §12.

---

## Phase 1 Objective

Give Community Partners a correct data model — **organizations as first-class entities with many-to-many managers** — without building any partner-facing product surface yet. Today a "partner" is a `users.role` value plus a `partners` row 1:1 with a single user; neither expresses "one organization, several staff" or "one person managing several organizations."

This phase closes that specific gap, non-destructively, so Phase 2 (Partner Events + ticketing — the actual launch) has something correct to build on. It intentionally ships **zero user-facing change**: launch is concierge-run (Somacord staff acts on partners' behalf), so there is no dashboard, invite flow, or application form to build yet.

## User Flows

There is no consumer- or partner-facing flow in this phase. The only flow is operational:

1. **Somacord staff onboards a partner** (e.g. a coffee shop for the first Partner Event): using the service-role client or Supabase Studio directly, staff creates an `organizations` row and an `organization_managers` row (`role = 'owner'`) for the partner contact — if that contact even has a Somacord account yet. No partner action is required for this phase.
2. **Regression flow**: every existing user-facing flow (signup, onboarding, sign in, gathering create/edit/publish, RSVP, profile) must behave identically before and after this migration — Phase 1 adds tables nothing reads yet, so nothing should change for any existing page.

## Database Requirements

**New tables** (`supabase/migrations/`, next timestamp after `20260723010705_gathering_publishing.sql`):

```sql
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text not null check (organization_type in (
    'coffee_shop','restaurant','brewery','coworking_space','club',
    'hobby_group','event_organizer','community_organization','nonprofit'
  )),
  description text,
  city_id uuid references public.cities(id),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

create table public.organization_managers (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'manager' check (role in ('owner', 'manager')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
```

**Schema change on an existing table:**
```sql
alter table public.users
  drop constraint if exists users_role_check,
  add constraint users_role_check check (role in ('member', 'community_partner', 'admin'));
```

**RLS** (both new tables `enable row level security`):
- `organizations`: `select` public; `insert` restricted to `service_role`/`admin`; `update` allowed for `organization_managers` members or `admin`.
- `organization_managers`: members can view their own org's manager list; `role = 'owner'` or `admin` can insert/delete other managers.
- Both need `grant select/insert/update/delete ... to authenticated` and `grant select ... to anon` (organizations only) following the existing grant pattern in `20260723010703_initial_schema.sql`.

**Backfill** (same migration, non-destructive): for every existing `public.partners` row, insert one `organizations` row (`organization_name`→`name`, `organization_type`→`organization_type`, `verified`→`verified`) and one `organization_managers` row (`role = 'owner'`) pointing at `partners.user_id`. `public.partners` is not altered or dropped.

**Explicitly not touched:** `gatherings`, `rsvps`, `memberships`, `partners` (read-only for backfill), `speed_connect_sessions`. No `stripe_connect_account_id` column — deferred to Phase 6 per the last architecture review.

## Frontend Requirements

**None.** This phase ships no UI. No new pages, no new components, no changes to existing pages. Confirmed explicitly by the last architecture review (§0.6–§0.7 of the plan): self-serve partner UI is a later-phase concern, not a launch requirement, because launch is concierge-run.

## Backend Requirements

- `src/types/domain.ts`: add `Organization` and `OrganizationManager` interfaces; extend `UserRole` to `"member" | "community_partner" | "admin"`.
- `src/lib/supabase/auth.ts`: add `requireAdmin()`, mirroring the existing `requireUser()` pattern (redirect/error if `role !== 'admin'`).
- No new Server Actions, no new query module — nothing calls these tables yet, so query helpers (`getOrganizationById`, etc.) are deferred to Phase 2 where they're actually consumed. Building them now would be untested dead code.
- No Stripe, no env var changes.

## Deferred (explicitly out of scope for this phase)

| Deferred item | Belongs to |
|---|---|
| `gatherings.owner_type` / `organization_id` | Phase 2 |
| `event_ticket_tiers`, `event_tickets` | Phase 2 |
| Partner Event creation, editing, publishing | Phase 2 |
| `partner_promotions` (Option A) | Phase 2 |
| `partner_subscriptions` (Option B) | Phase 5 |
| Stripe products, Checkout, webhook endpoint | Phase 2+ |
| `organizations.stripe_connect_account_id`, Stripe Connect payouts | Phase 6 (final) |
| Self-serve organization/manager UI, manager invite flow | Post-launch, once concierge onboarding doesn't scale |
| Partner application/intake table | Not planned — a spreadsheet is sufficient while onboarding is manual |
| `requireOrganizationManager()` helper | Phase 2 (first phase that actually calls it) |
| Meetaway/Speed Connect freemium session limits | Separate, already-tracked gap (`database-schema.md`) — unrelated to Organizations |
| Event Series (recurring gatherings) | Documented-future only, no phase assigned |

## Acceptance Criteria

Phase 1 is done when all of the following are true:

1. `organizations` and `organization_managers` tables exist in the live Supabase project with RLS enabled and the policies above.
2. `users.role` accepts `'admin'` without breaking any existing row (constraint change verified additive, not destructive).
3. Every existing `public.partners` row has exactly one corresponding `organizations` row and one `organization_managers` row (`role = 'owner'`), verified by a row-count/spot-check query, not assumed.
4. `public.partners` is unchanged — same row count, same data, still readable by existing code paths (there are none that write to it post-migration, but nothing should have broken read access either).
5. A full regression pass of the existing app (`npm run typecheck`, `npm run lint`, `npm run build`, plus a manual walkthrough of signup → onboarding → gathering create/publish → RSVP) shows no behavior change.
6. A test `admin`-role user can `select`/`insert`/`update` `organizations` and `organization_managers` per the RLS policies; a regular `member` cannot write to an org they don't manage.
7. No frontend code changed. No Stripe code exists. No `gatherings` table change exists.

Not implemented until this plan and file are reviewed and approved.
