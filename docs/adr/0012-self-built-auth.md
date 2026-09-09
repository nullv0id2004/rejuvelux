# ADR-0012: Write authentication ourselves, with KORUM's mechanism as the reference

- **Status:** **Accepted** — 2026-09-09, by Sayon, who reviewed KORUM's auth implementation and
  directed the same mechanism here, with e-commerce session lengths and Google sign-in
- **Date:** 2026-09-09
- **Supersedes in part:** [ADR-0008](0008-admin-for-a-client-team.md) — **its identity clause
  only.** Everything else in ADR-0008 stands and is unchanged: the admin is for a non-technical
  client team, it lives inside the application, two fixed roles designed by us, the domain layer is
  the only writer, every mutation is audited, and Medusa's RBAC remains out of bounds.
- **Related:** [ADR-0006](0006-write-the-commerce-domain.md) (the same buy-vs-build question, answered
  the same way) · `features/accounts.md` · `features/admin.md` §8 · **R-36**, **R-78** (raised here)

## Context

[ADR-0008](0008-admin-for-a-client-team.md) (`Accepted`, 2 September 2026) chose **Supabase Auth
plus an `admin_user` table**, and named the reason precisely: *"Authentication is new attack
surface, and R-36 applies most sharply here. No CI, no staging, no second reviewer, and now a login
that guards the ability to change prices and stock. **Using Supabase Auth rather than writing
session handling is the main mitigation.**"* That mitigation is what this ADR gives up.

It also fixed a property worth naming, because this ADR reverses it: *"No password ever enters our
tables."*

**What changed on 9 September 2026.** Sayon read through the authentication built for **KORUM**
(`Worldhire/Worldhire2.0-1-`) — a self-built FastAPI JWT stack with refresh rotation, a
`token_version` kill-switch, per-account lockout, session-bound CSRF and Google/LinkedIn federation
— and directed that RejuveLuxe use the same mechanism instead of Supabase Auth.

Three decisions were taken the same day, each answered directly rather than assumed:

1. **One system for customers and the admin**, differentiated by role. This is materially larger
   than replacing the admin's login: `features/accounts.md` is an **empty stub**, checkout is
   guest-only, and customer accounts have never been specified.
2. **Split session lifetimes.** KORUM's 15-minute access and 7-day refresh are wrong for a
   storefront. Customers should not be logged out; an admin console that changes prices and stock
   should not stay open indefinitely on a shared laptop.
3. **Google *and* email/password.** Full parity with KORUM, which means `password_hash` in our
   tables and therefore bcrypt, reset tokens, lockout, timing-equalised failures and
   enumeration defences all become ours.

**What the current system actually is, measured rather than recalled.** Supabase is used for
**Postgres and auth only** — no Storage, no PostgREST data access. Auth touches five files
(`lib/server/auth/supabase.ts`, `session.ts`, `proxy.ts`, `app/admin/login/page.tsx`,
`app/admin/layout.tsx`, plus `scripts/bootstrap-owner.ts`) and **two cross-schema foreign keys**:
`customer.auth_user_id → auth.users ON DELETE SET NULL` and
`admin_user.auth_user_id → auth.users ON DELETE CASCADE`. Admin stage 1 is built on it and passes
15 of 17 checks.

## Decision

**We will write authentication ourselves in TypeScript, using KORUM's implementation as the
reference, and Supabase will host Postgres only.**

### Identity storage — `app_user` replaces `auth.users`

A new `app_user` table becomes the credential store, and the two existing `auth_user_id` columns
**repoint to it, keeping their names and their differing `ON DELETE` semantics**. This is
deliberately a drop-in substitution rather than a merge: the split ADR-0008 valued — credentials in
one place, commerce identity in `customer` / `admin_user` — is the shape Medusa uses and it survives
intact. Only the owner of the credential row changes.

```
app_user            id · email · password_hash (NULL for Google-only) · email_verified_at
                    token_version · failed_login_count · locked_until · last_sign_in_at
app_user_identity   user_id · provider ('google') · provider_account_id   UNIQUE(provider, id)
refresh_token       user_id · token_hash UNIQUE · audience ('customer'|'admin')
                    expires_at · absolute_expires_at · last_used_at · device_info
```

**Refresh tokens are stored hashed, not raw.** This is a deliberate departure from KORUM, which
stores the token verbatim in `refresh_tokens.token` — there, a database read mints a session.
Hashing costs nothing and removes that.

### Sessions — split by audience, which is the point of this ADR

| | Access | Refresh | Effect |
|---|---|---|---|
| **Customer** | 1 h | **90 d, sliding** | Effectively never signed out |
| **Admin** | 1 h | **12 h idle, 7 d absolute cap** | Re-authenticates roughly daily |

The `audience` column is what makes one refresh path serve both. A refresh presented past its idle
window or its absolute cap is refused; the customer window slides on use, the admin's absolute cap
does not.

### Mechanism — taken from KORUM, and each part earns its place

- **`token_version`.** A `tv` claim on every token; the guard rejects a stale one. A password
  change, reset, email change or "sign out everywhere" bumps it, killing **access** tokens too —
  not just refresh. Without it a stolen access token survives a password reset for its full life,
  which is the exact moment it matters.
- **Refresh rotation, single-use, store-then-delete.** A crash between the two must leave the user
  with a valid token, never zero. Every refresh token carries a unique `jti` — KORUM shipped a bug
  where two tokens minted in the same second were byte-identical and rotation deleted the token it
  had just stored.
- **Per-account lockout**, timed and never permanent: a permanent lock lets anyone who knows an
  email deny that account service.
- **One generic failure message** for every credential path, with bcrypt work burned on the
  account-not-found branch so timing does not distinguish it.
- **A cached liveness check** on every request reading `app_user` state, failing **open** on a
  database error — a transient blip must not sign everyone out — with concurrent misses coalesced.
- **Session-bound CSRF** on the cookie path: `<nonce>.<hmac(secret, nonce + user_id)>`. Plain
  double-submit only proves the cookie and header agree with each other, never that the value
  belongs to this session.

### Tokens live in httpOnly cookies, not `localStorage`

KORUM's deployed mode keeps JWTs in `localStorage`, readable by any script on the page; its own
plan carries this as open follow-up **F1**. We are one Next.js application on one origin, so the
reason F1 is hard there does not exist here. **We start where KORUM is trying to get to.**

### Deliberately deferred, and named rather than omitted

**Two-factor authentication is not built in this pass.** KORUM mandates email-OTP for every admin,
and that is a substantial part of why its admin is defensible. **We have no email provider** —
`features/notifications.md` is an empty stub and nothing in this codebase sends mail — so we cannot
have it. The tighter admin session above is partial compensation and should not be mistaken for an
equivalent. Recorded as **R-78**.

The same gap blocks **password reset and email verification**, which Supabase Auth was performing
for us. Consequently the build order is: **Google sign-in first, which needs no email at all**;
the password path lands only when a provider exists.

## Consequences

**We now own every part of this, and the list is the honest cost.** Password hashing and
verification, session issue and renewal, refresh rotation and reuse handling, credential-change
invalidation, brute-force lockout, enumeration and timing defences, CSRF, OAuth token exchange and
the Google identity link, plus the migration that moves two live foreign keys. ADR-0008's sentence
— *"Authentication is new attack surface, and R-36 applies most sharply here"* — **is still true and
is not mitigated away by this decision.** What changes is that the mitigation is now our tests
rather than a vendor's implementation.

**KORUM is evidence for the cost, not just the design.** Its auth reached this state through three
rounds of P0/P1 hardening after a formal audit, and its own plan still carries four open follow-ups.
Reading a working implementation reduces the risk of designing the wrong thing; it does not review
our code.

**Admin stage 1 is rebuilt, not extended.** `supabase.ts`, `session.ts`, `proxy.ts`,
`bootstrap-owner.ts`, the login page and the layout's sign-out all change, and
`scripts/admin-auth-test.ts` is rewritten. The two checks that have been SKIPPED since 2 September
for want of a password held only in Supabase Auth **become runnable**, because the password becomes
ours — a small gain from an expensive change.

**`features/accounts.md` has to be written before customer sign-in exists**, and it gates the
customer half of this work the way `data-model.md` gated the feature docs.

**Supabase becomes Postgres and nothing else.** No Auth, no Storage, no PostgREST. ADR-0002's
"one relational store" is unaffected; ADR-0009's region decision is unaffected.

**A dependency this project has avoided until now.** bcrypt (or argon2), a JWT library, and
Google's OAuth endpoints. `conventions.md`'s threshold for an ADR-worthy dependency is one that
"owns your data model, your auth, your build, or your deploy" — this owns auth, which is why it is
in an ADR rather than a commit message.

**Reversal is cheap today and expensive after the first real customer account.** There are zero
customers and one admin user. Once real people hold accounts, moving back to Supabase Auth means
migrating credentials nobody can read — password hashes are portable, Google links are portable,
but sessions are not.

## Alternatives rejected

- **Keep Supabase Auth — [ADR-0008](0008-admin-for-a-client-team.md)'s decision.** Costs nothing,
  is already working, already sends reset and verification email, already does Google, and is the
  named mitigation for R-36. It also imposes the 15-minute/1-hour session model this ADR exists to
  escape, though **that is configurable rather than fixed**, and it keeps passwords out of our
  tables. **Rejected by Sayon on 9 September 2026** in favour of one system he controls end to end,
  matching KORUM. **Would win** if the money-handling and credential-handling code together prove
  beyond one developer without review — the same failure mode ADR-0006 named and is still watching.
- **Auth.js (NextAuth) on our own Postgres.** The obvious middle path: keeps sessions, rotation,
  CSRF and Google in a maintained library while the data stays in our database, and it is the
  default answer for a Next.js application. Rejected because it brings its own schema and session
  model, and the instruction was specifically to use KORUM's mechanism — but **it is the strongest
  rejected option here**, and the one to reach for if this build stalls.
- **Google-only, no passwords.** Would have preserved ADR-0008's best property and made most of
  KORUM's hardening unnecessary — no bcrypt, no reset flow, no lockout, no enumeration defence.
  Rejected by Sayon: it excludes anyone without a Google account from buying or administering.
- **Google plus emailed magic links.** Also keeps passwords out of the database and stays open to
  everyone. Rejected on the same dependency that defers 2FA — it *requires* an email provider to
  work at all, where the password path merely requires one to be complete.
- **One merged `users` table, as KORUM has.** Simpler to read, and it is what the reference does.
  Rejected because it would collapse the credentials/commerce split that `customer` and
  `admin_user` already implement, force a larger migration, and lose the `ON DELETE` asymmetry that
  keeps a customer's orders alive while an orphaned admin row is deleted.
