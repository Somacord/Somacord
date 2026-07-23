# Somacord Integrations

## Stripe

Stripe is the payment provider for Somacord Membership.

### Product Configuration
- **Product name:** Somacord Membership
- **Description:** Membership includes one free Speed Connect each month, access to member gatherings, the ability to create gatherings, and participation in the Somacord community.

### Pricing (3 Stripe Prices on the one Product)
| Billing option | Price | Interval |
|---|---|---|
| Monthly | $39 | every 1 month |
| Quarterly | $99 | every 3 months |
| Yearly | $349 | every 1 year |

### Checkout Flow
Before completing Stripe Checkout, the member chooses a billing option — Monthly, Quarterly, or Yearly — in-app. That choice determines which Stripe Price ID is passed into the Checkout Session. See [database-schema.md](database-schema.md) for how the chosen plan is stored on the `memberships` record.

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
