/**
 * /admin/inventory — the list (features/admin.md §4, stage 2).
 *
 * Scarcest first, because the reason to open this page is almost always that
 * something is running out. Available is shown but never editable: it is
 * stocked minus what open orders have already claimed, so it is a consequence
 * rather than a number anyone should type.
 *
 * This is the surface that makes R-66 closable. The quantities in the database
 * are development values that were seeded to test the shop; until someone
 * counts the real stock and enters it here, nothing should be sold against them.
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { listInventory } from '@/lib/server/admin/inventory';
import { readNotice, type SearchParams } from '../form';
import { Notices } from '../notices';
import shell from '../admin.module.css';
import styles from './inventory.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inventory' };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const rows = await listInventory();
  const notice = readNotice(await searchParams);

  return (
    <>
      <h1 className={shell.pageTitle}>Inventory</h1>
      <p className={shell.pageIntro}>
        What is physically in stock, and what is already promised to orders that
        have not shipped. Sorted with the scarcest first. Every change asks for
        a reason and is recorded against your name.
      </p>

      <Notices notice={notice} />

      {rows.length === 0 ? (
        <p className={styles.empty}>No stock-tracked items exist yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className={styles.num}>In stock</th>
              <th scope="col" className={styles.num}>Promised</th>
              <th scope="col" className={styles.num}>Available</th>
              <th scope="col">
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.itemId}>
                <td>
                  <span className={styles.name}>{r.name}</span>
                  <span className={styles.sku}>{r.sku}</span>
                  {r.usedBy.length > 0 ? (
                    <span className={styles.usedBy}>
                      {r.usedBy
                        .map((u) =>
                          u.requiredQuantity > 1
                            ? `${u.productName} (×${u.requiredQuantity})`
                            : u.productName
                        )
                        .join(' · ')}
                    </span>
                  ) : (
                    <span className={styles.usedByNone}>Not used by any product</span>
                  )}
                </td>
                <td className={styles.num}>{r.stocked}</td>
                <td className={styles.num}>{r.reserved}</td>
                <td className={styles.num}>
                  <span
                    className={
                      r.state === 'out_of_stock'
                        ? styles.out
                        : r.state === 'low'
                          ? styles.low
                          : styles.ok
                    }
                  >
                    {r.available}
                  </span>
                </td>
                <td className={styles.actions}>
                  <Link
                    className={styles.adjust}
                    href={`/admin/inventory/${r.itemId}/adjust`}
                  >
                    Correct count
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className={styles.footnote}>
        <strong>Available</strong> is what is in stock minus what is promised to
        orders that have not been sent yet. It is worked out for you and cannot
        be edited directly: to change it, change the stock count or fulfil the
        orders holding it. A gift set is only as available as its scarcest part.
      </p>
    </>
  );
}
