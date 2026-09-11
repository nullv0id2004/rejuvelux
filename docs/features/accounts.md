# Feature — Accounts and Authentication

> **Purpose:** Who can sign in, how a session is issued and ended, and the security properties that
> hold for both audiences.
>
> **Status: written 9 September 2026, `PROVISIONAL`.** Written under
> [ADR-0012](../adr/0012-self-built-auth.md) (`Accepted`), which replaced Supabase Auth with an
> authentication stack we write, using KORUM's implementation
> (`Worldhire/Worldhire2.0-1-`) as the reference. Schema authority: `data-model.md`. The admin's
> half of this is governed by [ADR-0008](../adr/0008-admin-for-a-client-team.md) and
> `features/admin.md`, both of which stand except for ADR-0008's identity clause.
>
> **This document gates customer sign-in.** Nothing on the storefront may depend on an account
> until the sections below are built.

---

## 1. Scope

**In:** one credential store serving both audiences · Google sign-in · email and password ·
session issue, renewal and revocation · per-account lockout · credential-change invalidation ·
guest-to-account conversion · the customer's own order history and addresses · sign-out, including
sign-out everywhere.

**Out, and each for a stated reason:**

| Not building | Why |
|---|---|
| **Two-factor authentication** | No email provider exists — **R-78**. KORUM mandates email-OTP for admins and we cannot match that. Named, not forgotten |
| **Password reset**, email verification | Same missing provider. Supabase Auth was sending these; **this is a capability the project loses on the day ADR-0012 lands** and regains when a provider is chosen |
| Social providers beyond Google | LinkedIn and Apple are KORUM's, not ours. One provider is enough until a second is asked for |
| Passkeys / WebAuthn | Better than everything here, and a larger build. Revisit after launch |
| Customer-facing roles or permissions | A customer is a customer. The two admin roles are `features/admin.md` §3's and do not extend here |
| Saved payment methods | Razorpay is not integrated (ADR-0006's marked seam). Phase 3 |
| Account merging | Two accounts for one person — a Google sign-in and a password sign-in on the same address — are **linked**, not merged (§6.4). True merging of two distinct accounts with separate order histories is not built |

## 2. Audiences

**The customer.** Buys tea, occasionally. Will not remember a password. Should never be signed out
in normal use. May check out entirely as a guest and never create an account at all — **guest
checkout stays the default path and is not degraded by this feature.**

**The admin.** A non-technical client team member (`features/admin.md` §2). Signs in a few times a
week to correct stock, set a price, mark an order shipped. Guards the ability to change money and
inventory, so the session is deliberately shorter.

**One credential store, two audiences.** The same `app_user` row can hold both a `customer` and an
`admin_user` link — Sayon is both. The audience is a property of **the session**, not of the person:
signing in at `/admin/login` mints an admin-audience session; signing in on the storefront mints a
customer one. An admin-audience session is required for `/admin`; a customer session there is
refused even when the same person holds an `admin_user` row.

## 3. Sessions

| | Access | Refresh | Net effect |
|---|---|---|---|
| **Customer** | 1 h | **90 days, sliding** | Effectively never signed out |
| **Admin** | 1 h | **12 h idle, 7 d absolute cap** | Re-authenticates roughly daily |

- **Sliding** means the window moves forward on each use. The admin's *idle* window slides; its
  *absolute* cap does not — seven days after sign-in an admin signs in again regardless of activity.
- Both tokens live in **httpOnly cookies**, never `localStorage`. KORUM carries the move to cookies
  as open follow-up F1; we start where it is trying to get to (ADR-0012).
- Access tokens are stateless JWTs. Refresh tokens are rows, and rows can be revoked.

## 4. Surfaces

| Route | Does | Notes |
|---|---|---|
| `/sign-in` | Google, or email and password | One page, both methods. The only unguarded customer auth route |
| `/sign-up` | Create an account | Google creates one in a single step |
| `/account` | Order history, addresses, sign out | Guarded |
| `/account/security` | Change password, sign out everywhere, linked Google account | Guarded |
| `/auth/google/callback` | OAuth exchange | Never linked; reached only by redirect |
| `/admin/login` | The admin's sign-in | Mints an **admin-audience** session. Already exists; rebuilt on this stack |

**Checkout is not a sign-in wall.** A guest checks out with an email address and no account. If
that address later registers, the guest `customer` row gains the link and its order history follows
(`data-model.md` §5.1) — §6.4.

## 5. Behaviour rules

These are the invariants. Each one exists because its absence is a known failure.

1. **One generic failure message** for every credential path — wrong password, unknown address,
   locked account. Anything else is an account-existence oracle. Bcrypt work is burned on the
   not-found branch so timing does not distinguish it either.
2. **Lockout is timed, never permanent.** A permanent lock lets anyone who knows an email address
   deny that account service. Eight consecutive failures, then a backoff window; a correct password
   clears the counter.
3. **A credential change kills every live session**, not just refresh tokens. `token_version` is
   bumped on password change, password reset, email change and "sign out everywhere"; the guard
   rejects a token carrying a stale `tv`. Without this a stolen access token survives a password
   reset — the exact moment it matters most.
4. **Refresh tokens are single-use.** Each refresh issues a new token and deletes the old.
   Store-then-delete, so a crash between the two leaves the user with a valid token rather than
   none. Every token carries a unique `jti` — **KORUM shipped a bug where two tokens minted in the
   same second were byte-identical and rotation deleted the one it had just stored.**
5. **Refresh tokens are stored hashed.** A database read must not mint a session. (KORUM stores
   them raw; this is a deliberate departure.)
6. **The liveness check fails open.** A transient database error must not sign everyone out.
   A disabled account is refused; an unreachable database is not treated as a disabled account.
7. **The audience is checked, not assumed.** `/admin` requires an admin-audience session *and* an
   `admin_user` row with `status = 'active'`. Two gates, because a person can lose admin rights
   while holding a valid session.
8. **Nothing here bypasses the domain layer.** Sign-in reads and writes `app_user`; it never
   touches `order`, `cart` or inventory. `features/admin.md` §6.1 is unchanged.

## 6. Data

Four changes. Specified here, to be folded into `data-model.md` when built.

### 6.1 `app_user` — the credential store

Replaces Supabase's `auth.users`. `id` · `email` (UNIQUE, stored lowercased) · `password_hash`
(**NULL for Google-only accounts** — not every account has a password) · `email_verified_at` ·
`token_version` (int, NOT NULL, default 0) · `failed_login_count` · `locked_until` ·
`last_sign_in_at` · timestamps.

### 6.2 `app_user_identity` — federated logins

`user_id` (FK → `app_user` ON DELETE CASCADE) · `provider` (CHECK in `'google'`) ·
`provider_account_id` · `created_at`. **UNIQUE (`provider`, `provider_account_id`)** — one Google
account cannot silently attach to two users.

### 6.3 `refresh_token`

`user_id` (FK → `app_user` ON DELETE CASCADE) · `token_hash` (**UNIQUE**) · `audience` (CHECK in
`'customer'`, `'admin'`) · `expires_at` · `absolute_expires_at` · `last_used_at` · `device_info` ·
`created_at`. The `audience` column is what lets one refresh path serve two session policies.

### 6.4 The two existing foreign keys repoint

`customer.auth_user_id` and `admin_user.auth_user_id` **keep their names and their differing
`ON DELETE` semantics**, and point at `app_user` instead of `auth.users`:

| Column | ON DELETE | Why it differs |
|---|---|---|
| `customer.auth_user_id` | **SET NULL** | A customer's orders must outlive their account |
| `admin_user.auth_user_id` | **CASCADE** | An admin identity with no credential behind it is a dead row; the audit trail outlives the person via `admin_action`'s own RESTRICT |

**Guest-to-account conversion** falls out of this: the guest `customer` row is matched on email at
registration and gains an `auth_user_id`. Order history follows for free (`data-model.md` §5.1).
**A guest email is unverified**, so `customer.email` is deliberately not unique — matching on it
grants history to whoever proves control of the address, which is why verification (R-78) matters
before this path is trusted with anything sensitive.

RLS: deny-all like every other table (`data-model.md` §9.1). The domain layer connects as `postgres`
and is the only reader.

## 7. Build order

Strict. **Google first, because it is the only path that needs no email provider** (R-78).

| # | Stage | Exit criterion |
|---|---|---|
| 1 | Migration `0003`: the three tables, both FKs repointed, existing rows migrated | The one live admin user signs in on the new stack; `bootstrap-owner` works |
| 2 | Token core: issue, verify, rotate, `token_version`, hashed storage, the guard | A rotated token is single-use; a stale `tv` is refused; a suspended admin is refused |
| 3 | Google sign-in, both audiences | An account is created from Google alone and reaches `/account` and `/admin` |
| 4 | Email and password: hashing, lockout, timing burn, generic errors | Eight failures lock; a correct password clears; timing does not distinguish an unknown address |
| 5 | Customer surfaces: `/sign-in`, `/sign-up`, `/account`, guest conversion | A guest order appears in the account that later registers on that address |
| 6 | Session management: sign out, sign out everywhere, `/account/security` | "Sign out everywhere" invalidates a session held in another browser within one access-token life |
| 7 | **Blocked on R-78** — password reset, email verification, admin 2FA | An email provider exists |

Stages 1 and 2 must precede everything. **Admin stage 1 in `features/admin.md` §8 is rebuilt by
stages 1–4 here**, and its two long-SKIPPED checks become runnable, because the password becomes
ours rather than Supabase's.

## 8. Dependencies

A password hasher (bcrypt or argon2) · a JWT library · Google OAuth credentials — **an ask-first
dependency: a Google Cloud project, a client ID and secret, and authorised redirect URIs, none of
which exist yet** · `app_user` and its migration · an email provider for stage 7 (**R-78**, does not
exist).

## 9. Open questions

- **What happens to a signed-in customer's cart** when the cart moves server-side in Phase 2. A cart
  keyed by cookie and an account keyed by session must reconcile on sign-in; the rule is not decided.
  Raised as an open item against `features/cart.md`, not answered here.
- **Account deletion and erasure** interact with DPDP (**R-41**, deferred by ADR-0006).
  `app_user` deletion cascades to identities and refresh tokens and sets `customer.auth_user_id`
  NULL — but what is *erased* versus *anonymised* is R-41's question, not this document's.
- **Whether an admin may sign in with Google at all**, or must use a password. Google is convenient
  and keeps a password out of our tables for that account; it also puts admin access behind a
  third-party account whose recovery we do not control. **PROVISIONAL: both permitted.**
- **Rate limiting.** KORUM has a per-IP fixed-window limiter in front of its auth endpoints; this
  project has none, anywhere. Per-account lockout (§5.2) covers a targeted attack but not broad
  credential stuffing across many accounts. Not built in this pass.
