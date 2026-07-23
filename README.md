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
| Payments           | [Stripe](https://stripe.com) (Founding Membership, $39/month) |
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
configured — Supabase/Stripe/Resend calls are only made lazily, from
inside the specific feature code that needs them (none of which exists
yet in this foundation pass). Fill in `.env.local` before building
features that touch auth, billing, or email.

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
    membership/             /membership
    partners/                /partners (Community Partners)
    speed-connect/           /speed-connect ("How It Works")
    about/                   /about
    contact/                 /contact
    signin/ , signup/        Sign In / Join Somacord (UI only — see note below)
    style-guide/             Internal, unlinked design-system reference page
    globals.css              Design tokens (colors, fonts, radii) via Tailwind v4 @theme
    robots.ts / sitemap.ts

  components/
    layout/                  Chrome shared by every page: Container, Section, SiteHeader, SiteFooter
    ui/                      Reusable design-system primitives (Button, Card, GatheringCard,
                             PricingCard, Hero, Steps, Faq, EmptyState, Input/Textarea/Select/
                             FormField, Panel, badges/tags, etc.)
    gatherings/              Gathering-feature compositions (GatheringsBrowser, RsvpButton, AttendeeStack)
    forms/                   Page-level form compositions (ContactForm, SignInForm, SignUpForm)

  config/
    site.ts                  Nav links, membership pricing, launch city, footer — single source of truth
    media.ts                 Approved photography library, mapped to /public/images

  data/
    gatherings.ts             Mock gathering listings (all explicitly "Example" — see Launch Honesty Rule)
    faq.ts                    FAQ copy for Homepage / Membership, grounded in approved docs
    content.ts                Values, partner, and journey copy sourced from approved docs

  lib/
    env.ts                    Typed, lazily-validated environment variable access
    fonts.ts                  next/font setup for Lora + Work Sans
    utils.ts                  cn() class-merging helper
    stripe.ts / resend.ts     Lazily-instantiated server-only SDK clients
    supabase/                 Browser client, server client, and middleware session helper

  types/
    domain.ts                 TypeScript types mirroring the approved database schema

middleware.ts                Refreshes the Supabase auth session per request (no-ops if
                             Supabase env vars aren't set yet)
public/
  brand/                      Copied from /assets/brand — logo lockups
  images/                     Copied from /assets/mockups/photography — approved photo library
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
- **Membership** (`/membership`) — Founding Membership pricing, benefits, example monthly rhythm, FAQ, join CTA.
- **Community Partners** (`/partners`) — why partner, partner types ("who it's for"), how it works, apply CTA.
- **How It Works** (`/speed-connect`) — Speed Connect explainer + the Discover → Join a Speed Connect → Attend Gatherings → Build Friendships journey.
- **About** (`/about`) — mission, why Somacord exists, values (the approved product principles).
- **Contact** (`/contact`), **Sign In** (`/signin`), **Join** (`/signup`) — new pages not covered by the original mockup, built consistently with the same design system.

All gathering listings are mock data (`src/data/gatherings.ts`), sourced from the approved mockup
and always rendered with an `ExampleTag`, per the Launch Honesty Rule — no fabricated testimonials,
event counts, or community statistics anywhere on the site.

**Not implemented yet (by design):** authentication/session logic, Stripe checkout, RSVP/
Speed-Connect persistence, and email sending. The Sign In / Join forms and the Contact form are
fully styled and interactive on the client (validation, local success states) but don't call
Supabase, Stripe, or Resend yet — see the "lazily-instantiated" clients in `src/lib/`. City pages
(`/cities/[city]`) and the member account flow (onboarding, member home, profile, create
gathering) are also out of scope for this pass — see
[`docs/product/mvp-requirements.md`](somacord-docs/docs/product/mvp-requirements.md) for full MVP
scope. The primary nav's "Cities" link points to `/cities/salt-lake-city`, which doesn't exist
yet and will 404 until that page is built.
