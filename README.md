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
  app/                  App Router routes
    layout.tsx          Root layout: fonts, <SiteHeader>, <SiteFooter>
    page.tsx            Homepage (foundation pass — hero only, see below)
    style-guide/         Internal, unlinked design-system reference page
    globals.css          Design tokens (colors, fonts, radii) via Tailwind v4 @theme
    robots.ts / sitemap.ts

  components/
    layout/              Chrome shared by every page: Container, Section, SiteHeader, SiteFooter
    ui/                   Reusable design-system components (Button, Card, GatheringCard,
                           PricingCard, Hero, Steps, SplitLayout, badges/tags, etc.)

  config/
    site.ts               Nav links, membership pricing, launch city — single source of truth
    media.ts               Approved photography library, mapped to /public/images

  lib/
    env.ts                 Typed, lazily-validated environment variable access
    fonts.ts                next/font setup for Lora + Work Sans
    utils.ts                cn() class-merging helper
    stripe.ts / resend.ts    Lazily-instantiated server-only SDK clients
    supabase/                Browser client, server client, and middleware session helper

  types/
    domain.ts               TypeScript types mirroring the approved database schema

middleware.ts             Refreshes the Supabase auth session per request (no-ops if
                           Supabase env vars aren't set yet)
public/
  brand/                    Copied from /assets/brand — logo lockups
  images/                   Copied from /assets/mockups/photography — approved photo library
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

## What's in this foundation pass — and what's next

This pass intentionally stops at the **application foundation**: shared
layout, navigation, design system, configuration, and reusable UI
components. It does **not** implement product features yet. Specifically
built:

- Root layout with sticky header (desktop nav + working mobile menu) and footer, matching the
  approved website mockup exactly.
- Full design-token system (colors, type, radii) and a component library (Button, Card,
  GatheringCard, Avatar, badges/tags, Hero, Steps, CheckList, PricingCard, PartnerTypeCard,
  FilterPill, SplitLayout, SectionHeader).
- Site configuration (`src/config/site.ts`) as the single source of truth for nav, membership
  pricing, and the Salt Lake City launch market.
- Supabase (browser + server clients, auth-session middleware), Stripe, and Resend client
  scaffolding — configured, typed, and ready for feature code to import, but not wired into any
  page yet.
- Domain types mirroring the approved database schema.
- A homepage that renders only the approved hero section using the shared design system.
- `/style-guide`: an internal, unlinked reference page rendering every reusable component.

**Explicitly not built yet** (see
[`docs/product/mvp-requirements.md`](somacord-docs/docs/product/mvp-requirements.md) for full
scope): Gatherings discovery/detail, Speed Connect, Membership (Stripe checkout), Community
Partners, City pages, and the full account flow (signup, onboarding, member home, profile,
create gathering). Build these as separate, focused follow-up passes against the components and
config already in place here.
