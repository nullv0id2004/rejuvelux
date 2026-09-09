/**
 * Admin sign-in — the only unguarded admin route (features/admin.md §4).
 *
 * A server action, not a client-side call: the session cookies are written
 * server-side, so no token is ever handled by page JavaScript. This is also why
 * the page ships no client bundle at all, which serves §6.6 (admin code never
 * reaches a public bundle).
 *
 * Rebuilt on the self-built stack by ADR-0012. The failure handling below is
 * unchanged in spirit and stricter in fact: `signInWithPassword` returns ONE
 * message for every credential outcome and burns equal bcrypt time on the
 * account-not-found path, so neither the wording nor the clock distinguishes a
 * missing address from a wrong password.
 */

import { redirect } from 'next/navigation';
import { setSessionCookies } from '@/lib/server/auth/cookies';
import { signInWithPassword } from '@/lib/server/auth/signin';
import styles from './login.module.css';

export const metadata = { title: 'Sign in' };

/**
 * Never prerendered. A sign-in page reads searchParams and touches cookies, so
 * it is dynamic by nature — and without this the build tries to render it at
 * compile time, where the auth secrets may legitimately be absent, turning a
 * runtime requirement into a build failure. Caught by the build on 4 Sep 2026,
 * when exactly that happened with the Supabase variables.
 */
export const dynamic = 'force-dynamic';

async function signIn(formData: FormData) {
  'use server';

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!email || !password) {
    redirect(`/admin/login?error=missing&next=${encodeURIComponent(next)}`);
  }

  const result = await signInWithPassword(email, password, 'admin');

  if (!result.ok) {
    // One message for every credential outcome — see the file header. `locked`
    // is the single exception, and it is only reachable by someone who has
    // already failed eight times, so it reveals nothing they did not cause.
    const kind = result.message.startsWith('Too many') ? 'locked' : 'invalid';
    redirect(`/admin/login?error=${kind}&next=${encodeURIComponent(next)}`);
  }

  await setSessionCookies('admin', result.session, result.userId);

  // Only ever return to an /admin path: `next` comes from the query string, so
  // treating it as a trusted redirect target would be an open redirect.
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className={styles.shell}>
      <form className={styles.card} action={signIn}>
        <h1 className={styles.title}>RejuveLuxe</h1>
        <p className={styles.subtitle}>Sign in to manage the shop.</p>

        {error ? (
          <p className={styles.error} role="alert">
            {error === 'missing'
              ? 'Enter both your email address and password.'
              : error === 'locked'
                ? 'Too many failed attempts. Try again in a few minutes.'
                : 'That email address and password do not match an account.'}
          </p>
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>Email address</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="username"
            required
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>

        <input type="hidden" name="next" value={next ?? '/admin'} />

        <button className={styles.submit} type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
