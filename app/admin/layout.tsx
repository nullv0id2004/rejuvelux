/**
 * Admin shell — features/admin.md §4.
 *
 * The login page shares this layout but not its chrome: it has no session, so
 * the nav would have nothing to show. It renders bare, and every other admin
 * route renders inside the shell.
 *
 * Server component throughout. No admin JavaScript reaches the browser, which
 * is how §6.6 ("admin code never reaches a public bundle") is satisfied by
 * construction rather than by vigilance.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/server/auth/session';
import { clearSessionCookies, readSessionCookies } from '@/lib/server/auth/cookies';
import { revokeSession } from '@/lib/server/auth/sessions';
import styles from './admin.module.css';

export const metadata = { title: 'Admin' };

/** Stage-1 nav. Later stages fill in the rest of §4's route table. */
const NAV: { href: string; label: string; ownerOnly?: boolean }[] = [
  { href: '/admin', label: 'Today' },
  { href: '/admin/inventory', label: 'Inventory' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/users', label: 'Users', ownerOnly: true },
  { href: '/admin/audit', label: 'Audit' },
];

async function signOut() {
  'use server';
  // Delete the row as well as the cookies. Clearing cookies alone would leave a
  // usable refresh token behind, so a copied cookie would still renew a session
  // the user believes they ended.
  const { refresh } = await readSessionCookies('admin');
  if (refresh) await revokeSession(refresh);
  await clearSessionCookies('admin');
  redirect('/admin/login');
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // No session: this is the login page (middleware redirects everything else).
  // Render it without chrome.
  if (!session) return <>{children}</>;

  const items = NAV.filter((i) => !i.ownerOnly || session.role === 'owner');

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <span className={styles.brand}>RejuveLuxe</span>
        <nav className={styles.nav} aria-label="Admin sections">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.who}>
          <span className={styles.email}>{session.email}</span>
          <span className={styles.role}>{session.role}</span>
          <form action={signOut}>
            <button className={styles.signOut} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
