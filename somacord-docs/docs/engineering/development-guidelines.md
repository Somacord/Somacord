# Somacord Development Guidelines

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming Stripe webhook events |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Default sender address for transactional email — `hello@somacord.com`. See [integrations.md](integrations.md#email) |

Somacord does not use NextAuth. There is no `NEXTAUTH_URL` or `NEXTAUTH_SECRET` — authentication runs through Supabase.

## Deployment Flow

```
GitHub  →  Cursor (development)  →  Vercel (deployment)
```

- **GitHub** holds source control and this documentation.
- **Cursor** is the development environment used to build against the repo.
- **Vercel** builds and deploys from GitHub.
- **Stripe** and **Resend** are configured entirely through environment variables (see above) — no separate infra setup.
- **Supabase** will be connected once the UI and flows are completed; until then, environment variables for it are reserved but not yet wired to a live project.

See [tech-stack.md](tech-stack.md) for the full stack list and [integrations.md](integrations.md) for how each third-party service is configured.

**Status:** Environment variables and deployment flow above reflect current implementation decisions. Coding-style conventions (formatting, linting, PR process) have not been drafted yet.
