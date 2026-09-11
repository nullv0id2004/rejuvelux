/**
 * /admin/products — the list (features/admin.md §4, stage 3).
 *
 * Every product in every status, because a draft and a retired product are
 * both things the client team may need to find. The price column is the
 * point of the page: "No price" is R-04 stated in a table cell, and the link
 * beside it goes to where the price is set.
 */

import Link from 'next/link';
import { requireAdmin } from '@/lib/server/auth/session';
import { listAdminProducts } from '@/lib/server/admin/products';
import { rupees } from '../format';
import { readNotice, type SearchParams } from '../form';
import { Notices } from '../notices';
import shell from '../admin.module.css';
import ui from '../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Products' };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const products = await listAdminProducts();

  return (
    <>
      <h1 className={shell.pageTitle}>Products</h1>
      <p className={shell.pageIntro}>
        What the shop sells. A product appears on the shop only while it is
        active, and can be bought only when its variant has a price and stock.
        Photography, taglines and FAQs live with the developers, not here.
      </p>

      <Notices notice={readNotice(sp)} />

      <div className={ui.actions} style={{ marginBottom: 20 }}>
        <Link className={ui.secondary} href="/admin/products/new">
          Add a product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className={ui.empty}>No products yet. Add one to start.</p>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Status</th>
                <th scope="col">Territory</th>
                <th scope="col">Variant</th>
                <th scope="col" className={ui.num}>Price</th>
                <th scope="col" className={ui.num}>Available</th>
                <th scope="col" className={ui.num}>Order</th>
                <th scope="col">
                  <span className={ui.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={ui.primaryCell}>{p.name}</span>
                    <span className={ui.sub}>/shop/{p.slug}</span>
                  </td>
                  <td>
                    <span
                      className={`${ui.badge} ${p.status === 'active' ? ui.badgeStrong : ''}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className={ui.muted}>{p.territory ?? 'None'}</td>
                  <td>
                    {p.variants.length === 0 ? (
                      <span className={ui.muted}>No variant</span>
                    ) : (
                      p.variants.map((v) => (
                        <span key={v.id} className={ui.sub} style={{ marginTop: 0 }}>
                          {v.sku} · {v.netQuantity}
                          {v.status !== 'active' ? ` · ${v.status}` : ''}
                        </span>
                      ))
                    )}
                  </td>
                  <td className={ui.num}>
                    {p.variants.map((v) => (
                      <span key={v.id} style={{ display: 'block' }}>
                        {v.pricePaise === null ? (
                          <span className={`${ui.badge} ${ui.badgeAccent}`}>No price</span>
                        ) : (
                          rupees(v.pricePaise)
                        )}
                      </span>
                    ))}
                  </td>
                  <td className={ui.num}>
                    {p.variants.map((v) => (
                      <span key={v.id} style={{ display: 'block' }}>
                        {v.availability}
                      </span>
                    ))}
                  </td>
                  <td className={ui.num}>{p.sortOrder}</td>
                  <td className={ui.rowActions}>
                    <Link className={ui.link} href={`/admin/products/${p.id}`}>
                      Edit
                    </Link>
                    <Link className={ui.link} href={`/admin/products/${p.id}/variants`}>
                      Price and variants
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={ui.footnote}>
        <strong>Available</strong> is how many can be bought right now, worked
        out from stock. A set is only as available as its scarcest part. Change
        stock on the Inventory page, not here.
      </p>
    </>
  );
}
