/**
 * The three sentences an admin screen can open with, and the one block a
 * staff member sees on an owner-only page. Server components; no state.
 */

import Link from 'next/link';
import type { Notice as NoticeValue } from './form';
import styles from './screen.module.css';

/** Renders `?done=` and `?refused=` from `readNotice()`, when present. */
export function Notices({ notice }: { notice: NoticeValue }) {
  return (
    <>
      {notice.done ? (
        <p className={`${styles.notice} ${styles.noticeDone}`} role="status">
          {notice.done}
        </p>
      ) : null}
      {notice.refused ? (
        <p className={styles.notice} role="alert">
          {notice.refused}
        </p>
      ) : null}
    </>
  );
}

/**
 * The second step of a consequential action (features/admin.md §6.3): the
 * consequence stated in a sentence, and the same form re-submitted with
 * `confirm=1`. Rendered above the form it confirms.
 */
export function ConfirmNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${styles.notice} ${styles.noticeConfirm}`} role="alert">
      {children}
    </p>
  );
}

/**
 * What a staff member sees on /admin/users. The page is not hidden — the nav
 * already omits it for staff — but a direct visit gets the reason rather than
 * an error page. features/admin.md §3: `owner` only.
 */
export function OwnerOnly() {
  return (
    <p className={styles.notice} role="alert">
      Only an owner can manage admin users. Ask an owner if you need someone
      invited, removed or their role changed. <Link href="/admin">Back to Today</Link>
    </p>
  );
}
