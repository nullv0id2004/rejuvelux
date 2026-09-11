# Environment

RejuveLuxe runs with **no environment variables set**. Every value below has a
default, so `npm install && npm run dev` works on a clean checkout.

Set them to point the site at a real domain, or once a feature that needs a
secret is built.

## Setup

```bash
cp .env.example .env.local   # then edit
npm run dev                  # restart after every env change
```

`.env.local` is gitignored. `.env.example` is committed and must never hold a
real secret.

## Variables

### In use

| Variable | Scope | Default | Required |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build time, public | `https://rejuveluxe.in` | Production |

**`NEXT_PUBLIC_SITE_URL`** — public origin of the site, no trailing slash.
Read in [`app/layout.tsx`](app/layout.tsx) as `metadataBase`, which Next.js
uses to turn relative canonical, Open Graph and Twitter image paths into
absolute URLs. Without the right value, links shared to WhatsApp, Instagram or
Slack preview against the wrong domain.

| Environment | Value |
|---|---|
| Local | `http://localhost:3000` |
| Preview | The preview deployment's URL |
| Production | `https://rejuveluxe.in` |

An invalid URL throws during `next build` — intentional, so a typo fails the
build instead of shipping broken share previews.

### Planned, not read yet

These are reserved for a server-side contact form. The current form validates in
the browser and opens the visitor's mail client via `mailto:`, so it needs none
of them. **Setting them today does nothing.**

| Variable | Scope | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Server, secret | Sends contact form mail |
| `CONTACT_TO_EMAIL` | Server | Inbox that receives submissions — `support@rejuveluxe.in` |
| `CONTACT_FROM_EMAIL` | Server | Verified sender address on the sending domain |

When that feature lands, move each row up to **In use** in the same change.

## How Next.js handles these

- **Server only by default.** A variable without the `NEXT_PUBLIC_` prefix
  never reaches the browser.
- **`NEXT_PUBLIC_` is inlined at build.** The value is copied into the
  JavaScript bundle during `next build` and frozen there. Changing it on the
  host needs a rebuild, not a restart. Never put a secret behind this prefix —
  anyone can read it in the page source.
- **Inlining needs a literal lookup.** `process.env.NEXT_PUBLIC_SITE_URL` is
  replaced; `process.env[name]` or a destructured `env.X` is not.
- **Load order**, first match wins:
  1. `process.env` (the host's settings, e.g. Vercel project variables)
  2. `.env.$(NODE_ENV).local`
  3. `.env.local` — skipped when `NODE_ENV=test`
  4. `.env.$(NODE_ENV)`
  5. `.env`

Reference: `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.

## Deploying

Set production values in the host's dashboard, not in a committed file. On
Vercel:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env pull .env.local      # sync hosted values down for local work
```

## Adding a variable

1. Read it with a literal `process.env.NAME`, with a sensible default or a
   clear failure.
2. Add it to `.env.example`, commented, with no real value.
3. Add a row to **In use** above: scope, default, where it is read.
4. Prefix with `NEXT_PUBLIC_` only if the browser genuinely needs it.
