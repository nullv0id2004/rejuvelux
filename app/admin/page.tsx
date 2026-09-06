/**
 * /admin — the worklist (features/admin.md §4).
 *
 * Not a dashboard. Every block is something to do, and two of them exist
 * because a risk is open for want of a field: unpriced products (R-04) and
 * uncounted stock (R-66).
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { getWorklist } from '@/lib/server/admin/worklist';
import shell from './admin.module.css';
import styles from './worklist.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const session = await requireAdmin();
  const work = await getWorklist();

  const nothingToDo =
    work.unpricedVariants.length === 0 &&
    work.lowStock.length === 0 &&
    work.ordersAwaitingFulfilment.length === 0 &&
    !work.stockNeverCounted;

  return (
    <>
      <h1 className={shell.pageTitle}>Today</h1>
      <p className={shell.pageIntro}>
        Signed in as {session.name ?? session.email}. Everything below needs
        someone to do something. An empty page is the good outcome.
      </p>

      {nothingToDo ? (
        <p className={styles.clear}>Nothing needs attention right now.</p>
      ) : null}

      {work.stockNeverCounted ? (
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Stock has never been counted</h2>
          <p className={styles.blockNote}>
            The quantities in the database are development values that were
            seeded to test the shop, not counts of real stock. Nothing should be
            sold against them. Set the real numbers on the inventory page; each
            change asks for a reason and is recorded.
          </p>
          <Link className={styles.action} href="/admin/inventory">
            Go to inventory
          </Link>
        </section>
      ) : null}

      {work.unpricedVariants.length > 0 ? (
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>
            {work.unpricedVariants.length === 1
              ? 'One product has no price'
              : `${work.unpricedVariants.length} products have no price`}
          </h2>
          <p className={styles.blockNote}>
            These appear on the shop but cannot be bought, because no price has
            been confirmed for them. Adding a price makes them purchasable
            immediately.
          </p>
          <ul className={styles.list}>
            {work.unpricedVariants.map((v) => (
              <li key={v.sku} className={styles.row}>
                <span className={styles.rowName}>{v.productName}</span>
                <span className={styles.rowMeta}>{v.sku}</span>
                <Link className={styles.rowAction} href={`/admin/products`}>
                  Set price
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {work.lowStock.length > 0 ? (
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Low or out of stock</h2>
          <p className={styles.blockNote}>
            Available means stocked minus what is already promised to open
            orders. A kit becomes unavailable when any single one of its parts
            runs out.
          </p>
          <ul className={styles.list}>
            {work.lowStock.map((l) => (
              <li key={l.sku} className={styles.row}>
                <span className={styles.rowName}>{l.name}</span>
                <span
                  className={
                    l.available <= 0 ? styles.rowOut : styles.rowMeta
                  }
                >
                  {l.available <= 0 ? 'Out of stock' : `${l.available} left`}
                </span>
                <Link className={styles.rowAction} href="/admin/inventory">
                  Adjust
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {work.ordersAwaitingFulfilment.length > 0 ? (
        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Orders waiting to be sent</h2>
          <ul className={styles.list}>
            {work.ordersAwaitingFulfilment.map((o) => (
              <li key={o.id} className={styles.row}>
                <span className={styles.rowName}>{o.orderNumber}</span>
                <span className={styles.rowMeta}>
                  {o.placedAt.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <Link
                  className={styles.rowAction}
                  href={`/admin/orders/${o.id}`}
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
