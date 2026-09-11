# Environment

The site needs a database and one auth secret to run. Everything else has a
default.

## Setup

```bash
cp .env.example .env   # then fill in the two required values
npm run dev            # restart after every env change
```

`.env` is gitignored. `.env.example` is committed and must only ever hold fake
values. The test and bootstrap scripts load `.env` directly
(`tsx --env-file=.env`), which is why it is `.env` and not `.env.local`.

## Variables

| Variable | Required | Scope | When unset |
|---|---|---|---|
| `DATABASE_URL` | Yes | Server, secret | Throws on import; no page renders, `next build` fails |
| `AUTH_JWT_SECRET` | Yes | Server, secret | Throws the first time auth runs; must be 32+ characters |
| `AUTH_JWT_REFRESH_SECRET` | No | Server, secret | Falls back to `AUTH_JWT_SECRET` |
| `AUTH_CSRF_SECRET` | No | Server, secret | Falls back to `AUTH_JWT_SECRET` |
| `NEXT_PUBLIC_SITE_URL` | No | Build time, public | `https://$VERCEL_PROJECT_PRODUCTION_URL`, else `http://localhost:3000` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Set by Vercel | Build time | Do not set by hand |
| `BASE_URL` | No | Test scripts only | `http://localhost:3000` |

### `DATABASE_URL`

Supabase Postgres through the **transaction pooler** (Supabase → Connect →
Transaction pooler URI). Read in `lib/server/db/client.ts`, which throws at
import if it is missing. The catalogue is loaded from the database by the root
layout, so a missing value breaks every route and the build, not just admin.

### `AUTH_JWT_SECRET`, `AUTH_JWT_REFRESH_SECRET`, `AUTH_CSRF_SECRET`

Read in `lib/server/auth/config.ts`. The access secret is validated loudly:
missing or under 32 characters throws rather than falling back, because a
default signing secret is an authentication bypass. Generate each with:

```bash
openssl rand -base64 48
```

Setting distinct refresh and CSRF secrets is recommended: with a single secret,
a leak of the access secret also mints 90-day refresh sessions.

### `NEXT_PUBLIC_SITE_URL`

Absolute origin for Open Graph and canonical URLs, read in `app/layout.tsx`.
Leave unset on Vercel until a custom domain exists; the project's production
URL is used automatically. Inlined at build time, so changing it needs a
rebuild, not a restart.

## How Next.js handles these

- Variables without `NEXT_PUBLIC_` never reach the browser.
- `NEXT_PUBLIC_` values are copied into the bundle at `next build` and frozen.
  Never put a secret behind that prefix.
- Load order, first match wins: `process.env` (the host) →
  `.env.$(NODE_ENV).local` → `.env.local` → `.env.$(NODE_ENV)` → `.env`.

## Deploying

Set values in the Vercel project (Settings → Environment Variables), never in
a committed file. `DATABASE_URL` and `AUTH_JWT_SECRET` must exist for
**Production and Preview** or those deployments fail to build. Redeploy after
adding them.

When adding a value from a terminal, pipe it without a trailing newline. A
stored carriage return turns a valid URL into `Invalid URL` at build time:

```bash
printf '%s' "$VALUE" | vercel env add DATABASE_URL production
```

## Adding a variable

1. Read it with a literal `process.env.NAME`, with a default or a loud failure.
2. Add it to `.env.example` with a fake value and a comment.
3. Add a row to the table above.
4. Use `NEXT_PUBLIC_` only if the browser genuinely needs it.
