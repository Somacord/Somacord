# Marketplace Implementation Plan

**Status:** Proposed architecture, revised per the final approved business model. **Not approved for implementation.** No database migrations or code have been written. Do not start building any part of this until it's reviewed and explicitly approved — see "Recommended Phasing" for how to approve it incrementally rather than all at once.

Source strategy: [/docs/business/business-model.md](../business/business-model.md), [pricing.md](../business/pricing.md), [community-partners.md](../business/community-partners.md).

**Revision note:** this replaces the first draft of this plan. Three corrections from that draft, per explicit direction: `users.role` keeps `community_partner` (not narrowed to `member | admin`); one-time/recurring paid events use dynamic Stripe Checkout Sessions rather than a persistent Stripe Price per event; and the `partners` → `organizations` migration must preserve existing data, not delete it.

---

## 1. Conflict Inventory — every place the current codebase disagrees with the approved model

| Area | Current implementation | Conflicts with |
|---|---|---|
| `users.role` | `'member' \| 'community_partner'` | Needs a third value, `'admin'`, for Somacord-owned events — `community_partner` itself is correct and stays (see §2) |
| `public.partners` | 1:1 with `users.id` (`user_id` primary key) | No way to express multiple managers per org, or one manager across multiple orgs |
| `public.gatherings.category` | `'community' \| 'partner'` display label only | Needs a third owner type (Somacord), plus an actual `organization_id` relationship, not just a label |
| `public.gatherings` | No pricing/ticketing columns at all | Partner Events and Official Somacord Events are frequently paid, sometimes bundled (ticket + drink, etc.) |
| `public.rsvps` | Free RSVP only (`going \| interested \| cancelled`) | No concept of a paid ticket, quantity, or payment reference — needs a **parallel** ticket system, not a replacement (see §5) |
| `public.memberships` | `plan` check constraint `'monthly' \| 'quarterly' \| 'yearly'`, price comment `39.00 \| 99.00 \| 349.00` | Approved model is Member Monthly/Annual at different numbers ($29/mo); Partner Monthly/Annual is a separate product entirely, not modeled at all |
| Free tier | Doesn't exist as a concept — every signed-in user can RSVP without limit | [pricing.md](../business/pricing.md#free)'s "limited RSVPs" for non-subscribers has zero enforcement |
| `src/lib/env.ts` | 3 static Stripe Price ID vars, one product (Membership) | Need Member (Monthly, Annual) and Partner (Monthly, Annual) as static products, plus a static Partner Promotion price — see §7 |
| `src/lib/stripe.ts` | Bare lazy client, no Checkout/webhook code at all | Every revenue stream in pricing.md needs a Checkout or subscription flow |
| `src/lib/actions/gatherings.ts` | `category` derived from `user.role === 'community_partner'`; no `organization_id`, no pricing fields | Partner Events must be created on behalf of an organization the acting user manages, with pricing |
| `src/types/domain.ts` | No `Organization`, `OrganizationManager`, ticket, or partner-billing types | New entities throughout this plan need types |
| `src/app/partners/page.tsx`, `src/data/content.ts`, `src/data/faq.ts` | Copy still states partners share Somacord Membership pricing | Factually wrong under the new model (flagged, not yet fixed — see prior commit) |
| Admin/Somacord-owned events | No admin role, no path to create an event owned by "Somacord" itself | Official Somacord Events need a creator identity that isn't a member or an organization, and must never be modeled as an organization (see §3) |
| Payouts | Nothing — no Stripe Connect account field anywhere | Revenue-share requires paying partners out — deferred to last phase, not launch (see §6) |
| Recurring events | No concept of a repeating gathering — each row is a one-off | Documented as a future enhancement only (see §9), not part of this plan's build scope |

---

## 2. Roles: `users.role` keeps `community_partner`

**Correction from the first draft**, which proposed narrowing `users.role` to `'member' | 'admin'` on the theory that "a coffee shop is an organization, not a role." That's true of the *organization*, but the person managing it still needs an identity:

> A coffee shop never logs in. A person logs in and manages one or more organizations. Organizations become separate entities, but partner users still need an identity for permissions and UI.

So `users.role` becomes a **three-value** enum: `'member' | 'community_partner' | 'admin'`.

- `community_partner` is a **UI/identity marker** — it's what makes the nav show "My Organizations," what makes onboarding treat someone as a partner contact, and what a support/admin view filters on. It is set when a user manages at least one organization.
- It is **not** the authorization source of truth for any specific action. Whether a user can edit a specific organization's profile or create a Partner Event on its behalf is always answered by `organization_managers` membership for *that* organization — never by the role flag alone. This matters because one user can manage several organizations, and the role can't tell you which one they're acting for.
- Keeping the two in sync: set `role = 'community_partner'` when a user's first `organization_managers` row is inserted; there's no requirement to revert it to `'member'` if they're later removed from every org — it's a "has been a partner contact" identity marker, not a live permission gate, and getting this slightly stale is harmless precisely because §8's RLS never trusts it for authorization.
- `admin` is new — the only role that can create Official Somacord Events (§3) and, absent a self-serve application flow, the role that assigns partner status by creating an organization + first manager (manual, consistent with the "no admin dashboards" MVP scope already in community-partners.md).

---

## 3. Organizations

Add Organizations as first-class entities — coffee shops, breweries, restaurants, coworking spaces, social clubs, nonprofits, event organizers, community groups:

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
  stripe_connect_account_id text,        -- null until revenue-share ships (§6, final phase)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_managers (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'manager' check (role in ('owner', 'manager')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
```

- One organization may have multiple managers; one user may manage multiple organizations — that's exactly what the `organization_managers` join table (not a foreign key on either side) is for.
- **Official Somacord Events are not organizations and must never be modeled as one.** There is no "Somacord" row in `organizations` — Somacord-owned events are identified purely by `gatherings.owner_type = 'somacord'` (§4), created by an `admin` user, with `organization_id` left null. Do not be tempted to create a synthetic "Somacord" organization row for consistency — that would let Somacord's own events accidentally pick up organization-scoped RLS, manager UI, and partner-billing code paths that don't apply to them.

---

## 4. Event Ownership (extends `gatherings`)

Three ownership models, one shared table, an owner-type discriminator instead of overloading `category`:

```sql
alter table public.gatherings
  add column owner_type text not null default 'member' check (owner_type in ('member', 'organization', 'somacord')),
  add column organization_id uuid references public.organizations(id);

-- category becomes a display label derived from owner_type, or is dropped in
-- favor of it — see "Migrations" for the backfill/compat approach.
```

| Owner type | Meaning | `organization_id` | Creator |
|---|---|---|---|
| `member` | Community Gathering | null | the member, via `created_by` |
| `organization` | Partner Event | set | any manager of that org, via `created_by` (audit only, not ownership) |
| `somacord` | Official Somacord Event | **null, always** | must be an `admin` user |

`RsvpButton`/`GatheringCard` already read a category label off the gathering — this becomes a three-way switch (Community / Partner / Somacord) instead of two.

---

## 5. RSVPs and Tickets — both systems, kept in parallel

**Explicit requirement: do not replace one with the other.** Free events keep using `rsvps` exactly as it works today; paid events get a separate ticketing system. They coexist:

```sql
create table public.event_ticket_tiers (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  name text not null,                    -- "General Admission", "Member Price"
  price numeric(10,2) not null,
  members_only boolean not null default false,
  capacity integer,
  created_at timestamptz not null default now()
);

create table public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  ticket_tier_id uuid references public.event_ticket_tiers(id),
  user_id uuid not null references public.users(id) on delete cascade,
  quantity integer not null default 1,
  amount_paid numeric(10,2) not null,
  stripe_checkout_session_id text,       -- see §7 — no stripe_price_id here; price is set inline per Checkout Session
  status text not null default 'confirmed' check (status in ('confirmed', 'refunded', 'canceled')),
  created_at timestamptz not null default now()
);
```

A gathering is either free (uses `rsvps` only, `event_ticket_tiers` empty) or paid (uses `event_tickets` only) — never both for the same gathering. "Attending" becomes: an `rsvps` row with `status = 'going'`, **or** an `event_tickets` row with `status = 'confirmed'`. One app-layer helper (`isAttending(gatheringId, userId)`) should check both rather than every call site re-deriving this.

---

## 6. Partner Billing (Option A & Option B)

```sql
create table public.partner_promotions (               -- Option A: one-time
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  gathering_id uuid references public.gatherings(id),
  pricing_type text not null check (pricing_type in ('flat_fee', 'revenue_share')),
  flat_fee numeric(10,2),
  revenue_share_percent numeric(5,2),
  stripe_checkout_session_id text,
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

`pricing_type` supports `'revenue_share'` in the schema from day one so no later migration is needed to add it — but **only `'flat_fee'` is buildable at launch**, since `'revenue_share'` depends on Stripe Connect (§7), which is explicitly the final phase. Launch scope for partner billing is Option A (flat fee only) + Option B — nothing else.

---

## 7. Payouts (final phase — not launch)

Revenue-share (Option A's alternative to the $99 flat fee) is the **only** thing that requires paying a partner out — flat fee and Option B subscriptions are both money flowing one direction (partner → Somacord), no payout mechanism needed. Confirmed launch scope explicitly excludes this:

> Launch should initially support: One-Time Partner Promotion, Partner Subscription. Revenue sharing and automated payouts can be implemented later.

When it is eventually built, it needs **Stripe Connect** (Express accounts — lowest onboarding friction for small local businesses): organization opts into revenue-share → `organizations.stripe_connect_account_id` created via Connect's hosted onboarding → ticket sales for that event use a destination charge/transfer split at `partner_promotions.revenue_share_percent` → `account.updated`/`transfer.created` webhooks keep payout status in sync. Highest compliance surface in this entire plan (KYC, 1099s, dispute liability shifts) — do this last, and only once flat-fee partner demand validates the model.

---

## 8. Stripe Products & Checkout

**Two different patterns, not one** — this is the second correction from the first draft:

**Static Products/Prices** (configured once in the Stripe dashboard, referenced by env var — recurring subscriptions only):

| Product | Price(s) | Env var(s) |
|---|---|---|
| Somacord Membership | Monthly ($29 launch target), Annual | `STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID`, `STRIPE_MEMBERSHIP_ANNUAL_PRICE_ID` |
| Partner Subscription | Monthly ($149), Annual ($1,500) | `STRIPE_PARTNER_SUBSCRIPTION_MONTHLY_PRICE_ID`, `STRIPE_PARTNER_SUBSCRIPTION_ANNUAL_PRICE_ID` |
| Partner Event Promotion (Option A flat fee) | $99, one-time | `STRIPE_PARTNER_PROMOTION_PRICE_ID` |

Note: [pricing.md](../business/pricing.md#member-subscription) currently states the Member launch target as monthly-only, with annual explicitly "future." This table prepares the Annual Member price alongside Monthly per this instruction, but whether it's actually offered in the UI at launch is a pricing-doc decision, not an architecture one — the Stripe product/price and env var can exist unused until pricing.md says otherwise.

**Dynamic Checkout Sessions** (no persistent Stripe Product/Price object — built at checkout time from data in `event_ticket_tiers`/`partner_promotions`, using Stripe's inline `price_data` on the Checkout Session):
- Official Somacord Event tickets
- Paid Partner Event tickets (a Partner Event that itself sells admission, e.g. a $30 brewery mixer)

These vary per event and are set by whoever owns the event, not by Somacord — creating a permanent Stripe Price object for every single event would clutter the Stripe dashboard for no benefit; inline `price_data` is the standard pattern for this. This is why `event_ticket_tiers` has no `stripe_price_id` column and `event_tickets`/`partner_promotions` instead record `stripe_checkout_session_id`.

One webhook endpoint (`/api/webhooks/stripe`, doesn't exist yet) handles `checkout.session.completed`, `customer.subscription.updated/deleted`, and `payment_intent.succeeded`, branching on metadata to write `memberships`, `partner_subscriptions`, `partner_promotions`, or `event_tickets` via the service-role client (bypasses RLS, matches the existing `createSupabaseServiceRoleClient()` pattern already scaffolded in `src/lib/supabase/server.ts`).

---

## 9. Authentication & Permissions (RLS)

New/changed auth helpers (`src/lib/supabase/auth.ts` pattern):
- `requireOrganizationManager(organizationId)` — analogous to `requireUser()`; redirects/errors if the signed-in user has no `organization_managers` row for that specific org. This — not `role = 'community_partner'` — is the real gate (§2).
- `requireAdmin()` — gates Somacord-Event creation and any future partner-verification surface.

RLS changes, all additive (new policies/columns, not loosening existing ones):
- **`organizations`**: public `select` (org profiles should be discoverable); `insert` restricted to `service_role` only for now (manual assignment, no self-serve); `update` allowed for rows where the caller is an `organization_managers` member.
- **`organization_managers`**: members can view their own org's manager list; only `role = 'owner'` can insert/delete other managers.
- **`gatherings`**: existing policy (`status = 'published' or auth.uid() = created_by`) gets an `or exists (select 1 from organization_managers where organization_id = gatherings.organization_id and user_id = auth.uid())` clause, so any manager — not just the literal creator — can see and edit their org's drafts. Insert/update/delete policies need the same addition. Somacord events (`owner_type = 'somacord'`) additionally require the inserting user to be `role = 'admin'`.
- **`event_ticket_tiers`**: public `select` (pricing must be visible pre-purchase); write restricted to the gathering's owner (member creator, or any manager of its organization, or admin for Somacord events).
- **`event_tickets`**: buyer can view their own; gathering owner (member, org managers, or admin) can view tickets for their own events, for check-in/attendance.
- **`partner_promotions`, `partner_subscriptions`**: organization managers can view their own org's rows; all writes are `service_role`-only (billing state is webhook-driven, never user-editable directly).

---

## 10. Migrations — preserve existing data, don't delete `partners`

**Correction from the first draft**, which listed dropping `public.partners` as an eventual cleanup step without enough emphasis on the fact that it happens *only* after the new model is proven and *only* as an explicit, separately-approved step:

1. `organizations` + `organization_managers` + RLS. **Backfill, not replace:** for every existing `public.partners` row, insert a matching `organizations` row (mapping `organization_name`→`name`, `organization_type`→`organization_type`, `verified`→`verified`) and an `organization_managers` row (`role = 'owner'`) pointing at that `partners.user_id`. `public.partners` is left fully intact and untouched by this migration — nothing is deleted.
2. `gatherings.owner_type` + `gatherings.organization_id` + updated RLS. Backfill `owner_type` from the existing `category` (`'community'→'member'`, `'partner'→'organization'`), setting `organization_id` from the org backfilled in step 1 for that creator.
3. `event_ticket_tiers` + `event_tickets` + RLS.
4. `partner_promotions` + `partner_subscriptions` + RLS (`flat_fee` usable immediately; `revenue_share` present in the schema but not wired to any checkout flow until §7 ships).
5. `users.role` check constraint gains `'admin'`. `'community_partner'` is **kept**, not removed (§2) — this is an additive constraint change only.
6. Consumer/partner Stripe price corrections — `site.ts` and Stripe dashboard config updated per §8; `memberships.plan`/`price` check constraints are left as-is (non-breaking) even though the values they enumerate are stale, since narrowing them isn't required to fix the live pricing bug (the app just needs to stop writing the wrong values).
7. *(Final phase, separately approved — §7)* `organizations.stripe_connect_account_id` usage + Connect onboarding flow.
8. *(Cleanup, only after full confidence in the new model — requires its own explicit approval, not bundled with any of the above)* Deprecate/drop `public.partners` once every code path reads from `organizations`/`organization_managers` instead and the backfill has been verified row-for-row.

---

## 11. Future Enhancement — Event Series (documented only, not implemented)

Not part of this plan's build scope. Recorded here so the eventual design doesn't have to be re-derived from scratch.

**Concept:** a template that generates individual `gatherings` rows on a recurring schedule — e.g. "Coffee & Connect, every Thursday" automatically creates a new weekly gathering rather than an owner manually re-creating it each week.

**Sketch (not final, not for implementation):**

```sql
-- FUTURE — not part of this plan, do not implement
create table public.event_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_type text not null check (owner_type in ('member', 'organization', 'somacord')),
  organization_id uuid references public.organizations(id),
  created_by uuid not null references public.users(id),
  city_id uuid not null references public.cities(id),
  recurrence_rule text not null,     -- e.g. an RRULE string: "weekly on Thursday"
  default_location text,
  default_description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- gatherings generated from a series would carry a nullable series_id
-- back-reference for traceability (alter table gatherings add column series_id uuid references event_series(id))
```

Open questions to resolve when this is actually scoped: how far in advance instances are generated (rolling window vs. on-demand), what happens to already-RSVP'd/ticketed instances when a series is edited or paused, and whether ticket tiers are inherited per-instance or fixed at the series level.

---

## 12. Recommended Phasing

Confirmed launch scope (per direction): Free/Member consumer tiers, Option A flat-fee + Option B partner billing, RSVPs and tickets both live. Revenue-share/Connect explicitly deferred. Suggested build order, each phase shippable and useful on its own:

1. **Organizations entity** (§3, migration #1) — unblocks correct partner modeling with zero billing risk; `partners` untouched. No user-facing change required immediately.
2. **Consumer pricing correction** — Member Monthly Stripe price live (Annual prepared per §8 but gated by pricing.md's launch decision), `site.ts` update, migration #6. Smallest surface area, fixes the highest-visibility conflict (the live price is currently wrong).
3. **Event ownership + ticketing for Official Somacord Events only** (§4, §5, admin role, migration #2–3) — one owner type, no partner complexity, proves out the dynamic-Checkout-Session/webhook plumbing end to end.
4. **Partner Events + Option A flat-fee** (§6, migration #4 minus revenue-share) — organizations can now run paid events; Somacord charges them a flat $99, no payout obligation.
5. **Option B partner subscriptions** — recurring partner billing, same Checkout/webhook plumbing as consumer membership.
6. **Option A revenue-share + Stripe Connect payouts** (§7) — highest complexity and compliance surface; last, and only once flat-fee partner demand validates the model.

Stopping here per your instruction — no migrations or code until this revised plan is reviewed and approved.
