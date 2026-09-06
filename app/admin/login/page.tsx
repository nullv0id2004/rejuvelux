/**
 * Admin sign-in — the only unguarded admin route (features/admin.md §4).
 *
 * A server action, not a client-side Supabase call: the session cookie is set
 * server-side, so no auth token is ever handled by page JavaScript. This is
 * also why the page ships no client bundle at all, which serves §6.6 (admin
 * code never reaches a public bundle).
 */

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/server/auth/supabase';
import styles from './login.module.css';

export const metadata = { title: 'Sign in' };

/**
 * Never prerendered. A sign-in page reads searchParams and constructs an auth
 * client, so it is dynamic by nature — and without this the build tries to
 * render it at compile time, where the Supabase env vars may legitimately be
 * absent, turning a runtime requirement into a build failure. Caught by the
 * build on 4 Sep 2026, when exactly that happened.
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

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately one message for every failure: wrong password, unknown
    // address, disabled account. Distinguishing them tells an attacker which
    // addresses exist.
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

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
