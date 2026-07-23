# Somacord Integrations

## Stripe

**Status:** Superseded by the marketplace model — Stripe is the payment provider for several products now, not just membership. This section previously described a single "Somacord Membership" product with 3 prices ($39/$99/$349); that pricing and structure are stale. Full current design: [/docs/engineering/marketplace-implementation-plan.md](marketplace-implementation-plan.md#8-stripe-products-and-checkout) (not yet implemented).

### Product Configuration (target — not yet implemented)
Static, recurring-subscription products:
- **Somacord Membership** — Monthly ($29 launch target), Annual (prepared, launch TBD). Unlimited Meetaway Speed Connect is the flagship benefit — see [/docs/business/business-model.md](../business/business-model.md#meetaway-access). Full inclusions: [/docs/business/membership.md](../business/membership.md).
- **Community Partner Subscription** (Option B) — Monthly ($149), Annual ($1,500). A separate Stripe product from Membership — see [/docs/business/pricing.md](../business/pricing.md#community-partner-pricing-b2b).
- **Partner Event Promotion** (Option A flat fee) — $99, one-time.

Dynamic Checkout Sessions (no persistent Stripe Price object — priced inline per event):
- Official Somacord Event tickets
- Paid Partner Event tickets

### Checkout Flow (target — not yet implemented)
Recurring products (Membership, Partner Subscription) use a static Stripe Price ID per billing option, chosen in-app before Checkout. One-off paid events (Official or Partner) build the Checkout Session with inline pricing at purchase time instead. See [database-schema.md](database-schema.md#known-gaps-vs-business-model-v2) for what's actually implemented today (nothing — a single bare Stripe client exists, no Checkout or webhook code).

### Stripe Branding
- **Primary brand color:** `#1F4E5F` (Deep Cord Blue)
- **Accent color:** `#5E8C61` (Community Green)
- **Checkout/branding logo:** horizontal lockup (icon left, wordmark right) — [`somacord-logo-horizontal-light.png`](../../assets/brand/somacord-logo-horizontal-light.png)
- **Stripe icon:** standalone transparent "S" mark — [`somacord-icon-transparent.png`](../../assets/brand/somacord-icon-transparent.png)

See [/docs/brand/logo-guidelines.md](../brand/logo-guidelines.md) and [/docs/brand/colors.md](../brand/colors.md) for the source brand specs these are drawn from.

## Email

- **Provider:** Resend
- **Default sender:** `hello@somacord.com` — used as the default `from` address for all transactional email (signup confirmation, membership receipts, gathering notifications, etc.)
- Configured via the `RESEND_API_KEY` and `EMAIL_FROM` environment variables — see [development-guidelines.md](development-guidelines.md#environment-variables).

## Other Integrations
- **Cloudflare** — domain / DNS / security.
- **Meetaway** — powers the Speed Connect experience (`speed_connect_sessions.provider`). Internal/vendor name only; never customer-facing. See [database-schema.md](database-schema.md) and [/docs/brand/experience-language.md](../brand/experience-language.md).

## Deployment
GitHub → Cursor (development) → Vercel (deployment). Stripe and Resend are configured through environment variables; Supabase will be connected once the UI and flows are completed. Full detail: [development-guidelines.md](development-guidelines.md#deployment-flow).

**Status:** Stripe, email, and deployment configuration above reflect current implementation decisions. Cloudflare-specific setup has not been drafted yet.
