/**
 * /admin/invite/[token] — accept an invitation (features/admin.md §8, stage 5).
 *
 * The second and last unguarded admin route: the proxy lets it through because
 * an invitee has no session yet, and the token in the address is what admits
 * them. The page verifies it against `admin_invite` (hashed), takes a name and
 * a password, creates the credential and the admin identity together, and
 * signs them in. If the address already has an account on the shop, it asks
 * for that account's password rather than letting a link overwrite it.
 *
 * Renders bare, like the login page: there is no session to build chrome from.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { setSessionCookies } from '@/lib/server/auth/cookies';
import { acceptInvite, readInvite } from '@/lib/server/admin/users';
import { explainRefusal } from '@/lib/server/admin/refusal';
import { formatDate } from '../../format';
import { backTo, carry, initial, readNotice, text, type SearchParams } from '../../form';
import styles from '../../login/login.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Accept invitation' };

async function accept(formData: FormData) {
  'use server';
  const token = text(formData, 'token');
  const path = `/admin/invite/${encodeURIComponent(token)}`;
  const carried = carry(formData, ['name']);

  let result: Awaited<ReturnType<typeof acceptInvite>> | null = null;
  let refused: string | null = null;
  try {
    result = await acceptInvite(token, {
      name: text(formData, 'name'),
      password: String(formData.get('password') ?? ''),
    });
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused || !result) redirect(backTo(path, { refused: refused ?? undefined, carry: carried }));
  if (!result.ok) redirect(backTo(path, { refused: result.message, carry: carried }));

  await setSessionCookies('admin', result.session, result.userId);
  redirect(backTo('/admin', { done: 'Welcome. Your account is set up and you are signed in.' }));
}

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { token } = await params;
  const sp = await searchParams;
  const invite = await readInvite(decodeURIComponent(token));
  const notice = readNotice(sp);

  if (!invite) {
    return (
      <main className={styles.shell}>
        <div className={styles.card}>
          <h1 className={styles.title}>RejuveLuxe</h1>
          <p className={styles.subtitle}>
            This invitation is no longer valid. It may have been used, revoked or expired. Ask
            the person who invited you for a new link.
          </p>
          <p className={styles.note}>
            Already have an admin account? <Link href="/admin/login">Sign in</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <form className={styles.card} action={accept}>
        <h1 className={styles.title}>RejuveLuxe</h1>
        <p className={styles.subtitle}>
          You have been invited to manage the shop as <strong>{invite.role}</strong>, signing in
          as <strong>{invite.email}</strong>. This link works until {formatDate(invite.expiresAt)}.
        </p>

        {notice.refused ? (
          <p className={styles.error} role="alert">
            {notice.refused}
          </p>
        ) : null}

        <input type="hidden" name="token" value={decodeURIComponent(token)} />

        <label className={styles.field}>
          <span className={styles.label}>Your name</span>
          <input
            className={styles.input}
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            defaultValue={initial(sp, 'name', '')}
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {invite.hasAccount ? 'Your existing password' : 'Choose a password'}
          </span>
          <input
            className={styles.input}
            type="password"
            name="password"
            autoComplete={invite.hasAccount ? 'current-password' : 'new-password'}
            required
            minLength={invite.hasAccount ? 1 : 10}
          />
        </label>

        <p className={styles.note}>
          {invite.hasAccount
            ? 'An account already exists for this address. Enter its password to add admin access to it.'
            : 'At least 10 characters, with a letter and a number. There is no password reset yet, so keep it somewhere safe.'}
        </p>

        <button className={styles.submit} type="submit">
          Accept and sign in
        </button>
      </form>
    </main>
  );
}
