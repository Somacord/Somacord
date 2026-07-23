# Somacord — Web App

Somacord is a friendship-first social club: guided conversations and local
gatherings for adults who want a better social life. This is the Next.js
application for the Somacord MVP.

Product, brand, business, design, and engineering decisions live in
[`/somacord-docs`](somacord-docs) — read that first. This app is built
directly against those approved docs; when in doubt, the docs win.

## Stack

| Layer              | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org) (App Router), TypeScript        |
| Styling            | [Tailwind CSS v4](https://tailwindcss.com)                    |
| Database / Backend | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)  |
| Payments           | [Stripe](https://stripe.com) (Somacord Membership: $29/month) |
| Email              | [Resend](https://resend.com)                                  |
| Hosting            | [Vercel](https://vercel.com)                                  |

See [`somacord-docs/docs/engineering/tech-stack.md`](somacord-docs/docs/engineering/tech-stack.md)
for the full approved stack.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase / Stripe / Resend keys
npm run dev
```

The app runs at `http://localhost:3000` without any environment variables
configured — marketing pages render normally, and any page/action that
needs Supabase treats "not configured" as "signed out" (clean redirects,
no crashes) rather than throwing. Fill in `.env.local`, then apply the
migrations in `supabase/migrations/` to your Supabase project (via the
SQL editor or `supabase db push` once linked) before testing sign
up/in/out, onboarding, or the profile page for real.

### Supabase project setup (required for auth to work)

1. Create a project at [supabase.com](https://supabase.com) and copy its URL/anon key/service role
   key into `.env.local`.
2. Run the two migrations in `supabase/migrations/` against it (SQL editor, or `supabase link` +
   `supabase db push` with the CLI).
3. In the Supabase Dashboard → **Authentication → Sign In / Providers → Email**, enable "Confirm
   email" (this milestone's flow requires email verification).
4. In **Authentication → Sign In / Providers → Google**, add your Google OAuth Client ID/Secret
   (create one in Google Cloud Console with authorized redirect URI
   `https://<project-ref>.supabase.co/auth/v1/callback`).
5. In **Authentication → URL Configuration**, set the Site URL and add
   `<your-app-url>/auth/callback` to the redirect allow-list.

`supabase/config.toml` mirrors all of this for local development via the Supabase CLI
(`supabase start`), which needs Docker and isn't required for the steps above.

### Scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)  |
| `npm run build`        | Production build                  |
| `npm run start`        | Run the production build          |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | `tsc --noEmit`                    |
| `npm run format`       | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing  |

## Project structure

```
src/
  app/                     App Router routes
    layout.tsx             Root layout: fonts, <SiteHeader>, <SiteFooter>
    page.tsx                Homepage
    gatherings/             /gatherings (browse) and /gatherings/[slug] (detail)
    cities/[city]/          /cities/salt-lake-city (dynamic route, ready for more cities)
    membership/             /membership
    partners/                /partners (Community Partners)
    speed-connect/           /speed-connect ("How It Works")
    about/                   /about
    contact/                 /contact
    signin/ , signup/        Sign In / Join Somacord — real Supabase Auth (email+password, Google)
    forgot-password/         Request a password-reset email
    reset-password/          Set a new password (lands here from the recovery email link)
    auth/callback/           Route handler: exchanges the PKCE code for a session (email
                             confirmation, Google OAuth, and password recovery all land here)
    onboarding/profile/      7-step onboarding wizard (see docs/website/sitemap.md's `/onboarding/profile`)
    home/                    Member Dashboard (docs/website/sitemap.md's `/home`) — auth + onboarding required
    profile/                 Member profile: edit info, avatar, interests, notification settings
    style-guide/             Internal, unlinked design-system reference page
    globals.css              Design tokens (colors, fonts, radii) via Tailwind v4 @theme
    robots.ts / sitemap.ts

  components/
    layout/                  Chrome shared by every page: Container, Section, SiteHeader, SiteFooter
    ui/                      Reusable design-system primitives (Button, Card, GatheringCard,
                             PricingCard, Hero, Steps, Faq, EmptyState, Input/Textarea/Select/
                             FormField, Panel, ToggleSwitch, badges/tags, etc.)
    gatherings/              Gathering-feature compositions (GatheringsBrowser, RsvpButton, AttendeeStack)
    forms/                   Auth + contact form compositions (SignIn/SignUp/ForgotPassword/
                             ResetPasswordForm, GoogleAuthButton, SignOutButton, ContactForm)
    onboarding/              7-step wizard (OnboardingWizard, ProgressSteps, StepActions, steps/*)
    profile/                 Profile page sections (ProfileInfoForm, AvatarUploader,
                             InterestsEditor, NotificationSettingsForm)

  config/
    site.ts                  Nav links, membership pricing, launch city, footer — single source of truth
    media.ts                 Approved photography library, mapped to /public/images

  data/
    cities.ts                 City content (activity categories) — Salt Lake City only for now
    faq.ts                    FAQ copy for Homepage / Membership, grounded in approved docs
    content.ts                Values, partner, and journey copy sourced from approved docs
    onboarding.ts              Interest and availability options for the onboarding wizard
    dashboard.ts               Placeholder data for the Member Dashboard sections

  lib/
    env.ts                    Typed, lazily-validated environment variable access
    fonts.ts                  next/font setup for Lora + Work Sans
    utils.ts                  cn() class-merging helper
    stripe.ts / resend.ts     Lazily-instantiated server-only SDK clients
    supabase/                 Browser client, server client, middleware session helper,
                             and auth.ts (getCurrentUser / requireUser / requireOnboarded)
    actions/                   Server Actions: auth.ts, onboarding.ts, profile.ts

  types/
    domain.ts                 TypeScript types mirroring the approved database schema

middleware.ts                Refreshes the Supabase auth session and gates protected routes
                             (/home, /onboarding, /profile) — see src/lib/supabase/middleware.ts
public/
  brand/                      Copied from /assets/brand — logo lockups
  images/                     Copied from /assets/mockups/photography — approved photo library
supabase/
  config.toml                 Local-dev Supabase CLI config (email confirmations + Google OAuth on)
  migrations/                  Full schema (users, profiles, cities, gatherings, rsvps,
                             memberships, partners, speed_connect_sessions), RLS policies, the
                             handle_new_user trigger, and the `avatars` Storage bucket
```

## Design system

All tokens come from the approved brand docs:

- Colors — [`docs/brand/colors.md`](somacord-docs/docs/brand/colors.md), implemented as Tailwind
  utilities (`bg-cord-blue`, `text-community-green`, `bg-soft-sky`, `bg-warm-sand`, `text-charcoal`, ...)
  via `@theme` in `src/app/globals.css`.
- Typography — [`docs/brand/typography.md`](somacord-docs/docs/brand/typography.md): Lora
  (headlines) + Work Sans (body/UI), loaded via `next/font/google` in `src/lib/fonts.ts`.
- Components — [`docs/design/design-system.md`](somacord-docs/docs/design/design-system.md):
  buttons, cards, gathering cards, navigation, and profile components, implemented under
  `src/components/ui`.

Visit `/style-guide` in a running dev server for a live reference of every
component listed above, rendered together.

## Build history

**Foundation pass:** shared layout, navigation, design tokens, configuration, Supabase/Stripe/
Resend client scaffolding, and the initial reusable UI component library.

**Public website pass (current):** every public marketing page built out with the approved copy,
photography, and mockups:

- **Homepage** — hero, How It Works, Featured Gatherings, Community Partners, Membership preview, FAQ, final CTA.
- **Gatherings** (`/gatherings`) — search + category filters, empty state, gathering cards.
- **Gathering Detail** (`/gatherings/[slug]`) — hero image, description, date/time, location, attendees, RSVP toggle, related gatherings.
- **Membership** (`/membership`) — Somacord Membership pricing ($29/month), benefits, example monthly rhythm, FAQ, join CTA.
- **Community Partners** (`/partners`) — why partner, partner types ("who it's for"), how it works, apply CTA.
- **How It Works** (`/speed-connect`) — Speed Connect explainer + the Discover → Join a Speed Connect → Attend Gatherings → Build Friendships journey.
- **About** (`/about`) — mission, why Somacord exists, values (the approved product principles).
- **Contact** (`/contact`), **Sign In** (`/signin`), **Join** (`/signup`) — new pages not covered by the original mockup, built consistently with the same design system.

Gathering listings are real data, stored in Supabase (`src/lib/queries/gatherings.ts`) — no
fabricated testimonials, event counts, or community statistics anywhere on the site.

**Review follow-ups pass:**

- **City page** (`/cities/[city]`) — dynamic route, `src/data/cities.ts` holds the content. Only
  Salt Lake City exists today, so the primary nav's "Cities" link resolves instead of 404ing.
- **Membership pricing** — renamed "Founding Membership" to **Somacord Membership**. Briefly
  offered Monthly/Quarterly/Yearly tiers; later consolidated back to a single **$29/month** plan
  per the approved pricing model (`somacord-docs/docs/business/pricing.md`) — the current state
  across the site, the approved docs, and `src/config/site.ts`.

**Authentication + Onboarding + Member Foundation pass (current):** real Supabase Auth, a 7-step
onboarding wizard, the Member Dashboard, and the Profile page.

- **Auth** — email/password sign up with email verification, sign in, sign out, forgot/reset
  password, and "Sign in with Google", all via Supabase Auth (`src/lib/actions/auth.ts`,
  `src/app/auth/callback/route.ts`). The existing Sign In (`/signin`) and Join (`/signup`) pages
  were wired up in place, not replaced. Sessions persist across refreshes via `@supabase/ssr`
  cookies; `middleware.ts` redirects signed-out visitors away from `/home`, `/onboarding`, and
  `/profile`, and redirects signed-in visitors away from `/signin`/`/signup`.
- **Onboarding** (`/onboarding/profile`) — 7-step wizard: Welcome, Name, City, Interests,
  Availability, optional Photo, Confirmation. Written to Supabase in one submit on "Finish";
  `requireOnboarded()` gates `/home` and `/profile` until it's done.
- **Member Dashboard** (`/home`) — Welcome, Upcoming Gatherings, Recommended Gatherings, Upcoming
  Speed Connect, My RSVPs, Community Updates. All placeholder data (`src/data/dashboard.ts`) —
  no RSVP/Speed-Connect backend logic yet, per this milestone's scope.
- **Profile** (`/profile`) — edit name, avatar upload (Supabase Storage), interest management,
  notification settings — each section its own small form/Server Action.
- **Database** — `supabase/migrations/` creates the full approved schema (see
  [database-schema.md](somacord-docs/docs/engineering/database-schema.md)) with Row Level
  Security on every table, plus a `handle_new_user` trigger and the `avatars` Storage bucket.
  Not yet connected to a live Supabase project in this environment — see "Supabase project setup"
  above.

**Not implemented yet (by design, out of scope for this milestone):** Stripe checkout/membership
billing, Speed Connect booking logic, gathering creation, and Community Partner management. See
[`docs/product/mvp-requirements.md`](somacord-docs/docs/product/mvp-requirements.md) for full MVP
scope.

## Next milestone

Stripe subscriptions/checkout for the Somacord Membership, using the plan choice already captured
in the Membership page's plan toggle (`src/config/site.ts`) and the `memberships` table already
in place. See "Remaining work before Stripe integration" in the PR description for the specific
gaps to close first (mainly: connecting a real Supabase project and testing the auth flows
end-to-end, which couldn't be done from this sandboxed environment).
