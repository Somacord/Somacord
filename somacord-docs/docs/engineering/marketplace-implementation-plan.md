# Marketplace Implementation Plan

**Status:** Proposed architecture, not approved. This is a plan document only — **no code or schema has been changed to produce it.** Do not implement any part of this without explicit sign-off; see "Recommended Phasing" at the end for how to approve it incrementally rather than all at once.

Source strategy: [/docs/business/business-model.md](../business/business-model.md), [pricing.md](../business/pricing.md), [community-partners.md](../business/community-partners.md).

---

## 1. Conflict Inventory — every place the current codebase disagrees with the approved model

| Area | Current implementation | Conflicts with |
|---|---|---|
| `users.role` | `'member' \| 'community_partner'` — partner-ness is a flag on a person | Partners are organizations; a person can manage 0, 1, or many orgs, and an org can have many managers |
| `public.partners` | 1:1 with `users.id` (`user_id` primary key) | No way to express multiple managers per org, or one manager across multiple orgs |
| `public.gatherings.category` | `'community' \| 'partner'` display label only | Needs a third owner type (Somacord), plus an actual `organization_id` relationship, not just a label |
| `public.gatherings` | No pricing/ticketing columns at all | Partner Events and Official Somacord Events are frequently paid, sometimes bundled (ticket + drink, etc.) |
| `public.rsvps` | Free RSVP only (`going \| interested \| cancelled`) | No concept of a paid ticket, quantity, or payment reference |
| `public.memberships` | `plan` check constraint `'monthly' \| 'quarterly' \| 'yearly'`, price comment `39.00 \| 99.00 \| 349.00` | Approved launch target is a single $29/month plan; quarterly/annual are explicitly future |
| Free tier | Doesn't exist as a concept — every signed-in user can RSVP without limit | [pricing.md](../business/pricing.md#free)'s "limited RSVPs" for non-subscribers has zero enforcement |
| `src/lib/env.ts` | 3 static Stripe Price ID vars, one product (Membership) | Need Member Subscription (1 price now), Partner Subscription (2 prices), Partner Promotion (1 price), and per-event ticket prices (created dynamically, not static env vars) |
| `src/lib/stripe.ts` | Bare lazy client, no Checkout/webhook code at all | Every revenue stream in pricing.md needs a Checkout or subscription flow |
| `src/lib/actions/gatherings.ts` | `category` derived from `user.role === 'community_partner'`; no `organization_id`, no pricing fields | Partner Events must be created on behalf of an organization the acting user manages, with pricing |
| `src/types/domain.ts` | No `Organization`, `OrganizationManager`, ticket, or partner-billing types | New entities throughout this plan need types |
| `src/app/partners/page.tsx`, `src/data/content.ts`, `src/data/faq.ts` | Copy still states partners share Somacord Membership pricing | Factually wrong under the new model (flagged, not yet fixed — see prior commit) |
| Admin/Somacord-owned events | No admin role, no path to create an event owned by "Somacord" itself | Official Somacord Events need a creator identity that isn't a member or an organization |
| Payouts | Nothing — no Stripe Connect account field anywhere | Option A's 15–20% revenue-share alternative requires paying partners out |

---

## 2. Organizations

Replace `public.partners` (1:1 user↔org) with a proper entity plus a many-to-many manager join:

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
  stripe_connect_account_id text,        -- null until they opt into revenue-share (Option A)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_managers (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'manager' check (role in ('owner','manager')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
```

- A user is just a user — no `community_partner` role needed to manage an org; presence in `organization_managers` is what grants access.
- `stripe_connect_account_id` is included now but only becomes relevant once Option A's revenue-share path ships (see "Payouts" and "Recommended Phasing").
- **`users.role` narrows to `'member' | 'admin'`.** `admin` is new — it's the only role that can create Official Somacord Events (see below) and, short of a self-serve application flow, the role that assigns partner status by creating an organization + first manager. This mirrors the "no admin dashboards, manual assignment" approach already documented in community-partners.md, just formalized as a role instead of ad hoc SQL.

---

## 3. Event Ownership (extends `gatherings`)

Add an owner-type discriminator instead of overloading `category`:

```sql
alter table public.gatherings
  add column owner_type text not null default 'member' check (owner_type in ('member', 'organization', 'somacord')),
  add column organization_id uuid references public.organizations(id);

-- category becomes a display label derived from owner_type, or is dropped in
-- favor of it — see "Migrations" for the backfill/compat approach.
```

- `owner_type = 'member'` → Community Gathering, `created_by` is the acting member, `organization_id` null.
- `owner_type = 'organization'` → Partner Event, `organization_id` set, `created_by` is whichever manager created it (for audit, not ownership).
- `owner_type = 'somacord'` → Somacord Event, `organization_id` null, `created_by` must be an `admin` user.

`RsvpButton`/`GatheringCard` already read a category label off the gathering — this becomes a three-way switch (Community / Partner / Somacord) instead of two.

---

## 4. Ticketing

Free gatherings keep using `rsvps` unchanged. Paid events need real ticket tiers and purchase records — a gathering can have zero, one, or several tiers (e.g. "$30 General" / "$45 VIP", or a members-only discounted tier):

```sql
create table public.event_ticket_tiers (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  name text not null,                    -- "General Admission", "Member Price"
  price numeric(10,2) not null,
  members_only boolean not null default false,
  capacity integer,
  stripe_price_id text,                  -- created dynamically per event, not a static env var
  created_at timestamptz not null default now()
);

create table public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  ticket_tier_id uuid references public.event_ticket_tiers(id),
  user_id uuid not null references public.users(id) on delete cascade,
  quantity integer not null default 1,
  amount_paid numeric(10,2) not null,
  stripe_payment_intent_id text,
  status text not null default 'confirmed' check (status in ('confirmed', 'refunded', 'canceled')),
  created_at timestamptz not null default now()
);
```

"Attending" becomes: an `rsvps` row with `status = 'going'` (free), **or** an `event_tickets` row with `status = 'confirmed'` (paid). App-layer helper (`isAttending(gatheringId, userId)`) should check both rather than every call site re-deriving this.

---

## 5. Partner Billing (Options A & B)

```sql
create table public.partner_promotions (               -- Option A: one-time
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  gathering_id uuid references public.gatherings(id),
  pricing_type text not null check (pricing_type in ('flat_fee', 'revenue_share')),
  flat_fee numeric(10,2),
  revenue_share_percent numeric(5,2),
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded')),
  created_at timestamptz not null default now()
);

create table public.partner_subscriptions (             -- Option B: ongoing
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade unique,
  plan text not null check (plan in ('monthly', 'annual')),
  price numeric(10,2) not null,
  status text not null default 'active' check (status in ('active', 'canceled')),
  stripe_subscription_id text,
  started_at timestamptz not null default now()
);
```

`pricing_type`/`plan` are exactly the "configurable rather than hardcoded" requirement — an organization's monetization choice lives in data, not in `if` branches.

---

## 6. Payouts

Only relevant for Option A's revenue-share alternative (flat fee never requires paying a partner out — Somacord only ever charges them). Needs **Stripe Connect** (Express accounts recommended — lowest onboarding friction for small local businesses):

1. Organization opts into revenue-share → `organizations.stripe_connect_account_id` created via Connect onboarding (hosted Stripe flow, minimal custom UI).
2. Ticket sale for that event: Stripe destination charge or transfer splits the payment at the percentage in `partner_promotions.revenue_share_percent`.
3. Webhook (`account.updated`, `transfer.created`) keeps payout status in sync.

This is the highest-complexity, highest-compliance-risk piece of the whole plan (KYC, 1099s, dispute liability shifts). **Recommend shipping flat-fee-only first** and deferring revenue-share/Connect entirely — see "Recommended Phasing."

---

## 7. Stripe Products/Prices

Static (configured once, referenced by env var — mirrors the existing `env.ts` pattern):

| Product | Price(s) | Env var(s) |
|---|---|---|
| Somacord Membership | $29/month | `STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID` (replaces the 3 existing membership price vars) |
| Partner Subscription | $149/month, $1,500/year | `STRIPE_PARTNER_SUBSCRIPTION_MONTHLY_PRICE_ID`, `STRIPE_PARTNER_SUBSCRIPTION_ANNUAL_PRICE_ID` |
| Partner Event Promotion | $99 one-time | `STRIPE_PARTNER_PROMOTION_PRICE_ID` |

Dynamic (created via the Stripe API at event-publish time, stored on the row, never in env):
- Official Somacord Event / Partner Event ticket tiers → `event_ticket_tiers.stripe_price_id`.

One webhook endpoint (`/api/webhooks/stripe`, doesn't exist yet) handling `checkout.session.completed`, `customer.subscription.updated/deleted`, and `payment_intent.succeeded`, branching on metadata to write `memberships`, `partner_subscriptions`, `partner_promotions`, or `event_tickets` via the service-role client (bypasses RLS, matches the existing `createSupabaseServiceRoleClient()` pattern already scaffolded in `src/lib/supabase/server.ts`).

---

## 8. Authentication & Permissions (RLS)

New/changed auth helpers (`src/lib/supabase/auth.ts` pattern):
- `requireOrganizationManager(organizationId)` — analogous to `requireUser()`; redirects/errors if the signed-in user has no `organization_managers` row for that org.
- `requireAdmin()` — gates Somacord-Event creation and any future partner-verification surface.

RLS changes, all additive (new policies/columns, not loosening existing ones):
- **`organizations`**: public `select` (org profiles should be discoverable); `insert` restricted to `service_role` only for now (manual assignment, no self-serve — consistent with the existing community-partners.md note); `update` allowed for rows where the caller is an `organization_managers` member.
- **`organization_managers`**: members can view their own org's manager list; only `role = 'owner'` can insert/delete other managers.
- **`gatherings`**: existing policy (`status = 'published' or auth.uid() = created_by`) gets an `or exists (select 1 from organization_managers where organization_id = gatherings.organization_id and user_id = auth.uid())` clause, so any manager — not just the literal creator — can see and edit their org's drafts. Insert/update/delete policies need the same addition.
- **`event_ticket_tiers`**: public `select` (pricing must be visible pre-purchase); write restricted to the gathering's owner (member creator, or any manager of its organization).
- **`event_tickets`**: buyer can view their own; gathering owner (member or org managers) can view tickets for their own events, for check-in/attendance.
- **`partner_promotions`, `partner_subscriptions`**: organization managers can view their own org's rows; all writes are `service_role`-only (billing state is webhook-driven, never user-editable directly).

---

## 9. Migrations (proposed order — each independently deployable)

1. `organizations` + `organization_managers` + RLS. Backfill: for every `public.partners` row, insert an `organizations` row and an `organization_managers` row (`role = 'owner'`) pointing at that `partners.user_id`.
2. `gatherings.owner_type` + `gatherings.organization_id` + updated RLS. Backfill `owner_type` from the existing `category` (`'community'→'member'`, `'partner'→'organization'` + set `organization_id` from the creator's backfilled org).
3. `event_ticket_tiers` + `event_tickets` + RLS.
4. `partner_promotions` + `partner_subscriptions` + RLS (flat-fee/subscription only — no `stripe_connect_account_id` usage yet).
5. `users.role` narrows to `'member' | 'admin'` — **not** a destructive rename; add `admin` to the check constraint, stop writing `'community_partner'` going forward. Existing `community_partner` rows can be left as-is or backfilled to `'member'` once their `organizations`/`organization_managers` rows exist (their access no longer depends on the role value either way).
6. `memberships.plan`/pricing correction — update `site.ts`/Stripe config to a single $29/month price; **do not** narrow the `plan` check constraint (non-breaking to leave `quarterly`/`yearly` as allowed-but-unused values, in case they ship later per pricing.md).
7. *(Deferred — see Phasing)* `organizations.stripe_connect_account_id` usage + Connect onboarding flow, once revenue-share is actually being built.
8. *(Cleanup, later)* Deprecate/drop `public.partners` once nothing reads it and the backfill is confirmed complete.

---

## 10. Recommended Phasing

This is a lot to build at once. Suggested approval/build order, each phase shippable and useful on its own:

1. **Organizations entity** (schema #1 above) — unblocks correct partner modeling with zero billing risk. No user-facing change required immediately.
2. **Consumer pricing correction** — single $29/mo Stripe price, `site.ts` update, migration #6. Smallest surface area, fixes the highest-visibility conflict (the live price is currently wrong).
3. **Event ownership + ticketing for Official Somacord Events only** (schema #2, #3, admin role) — one owner type, no partner complexity, proves out the Checkout/webhook plumbing end to end.
4. **Partner Events + Option A flat-fee** (schema #4, minus revenue-share) — organizations can now run paid events; Somacord charges them a flat $99, no payout obligation.
5. **Option B partner subscriptions** — recurring partner billing, same Checkout/webhook plumbing as consumer membership.
6. **Option A revenue-share + Stripe Connect payouts** — highest complexity and compliance surface; do this last, and only once flat-fee partner demand validates the model.

Waiting for approval before starting any of this, per your instruction — happy to scope Phase 1 or 2 in detail (file-by-file) as a next step once you pick where to start.
