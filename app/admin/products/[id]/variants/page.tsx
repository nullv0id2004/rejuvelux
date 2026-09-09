/**
 * /admin/products/[id]/variants — SKU, price, net quantity, status
 * (features/admin.md §4, stage 3).
 *
 * The price field is why this page exists, and the doc is explicit about it:
 * "Setting a price makes a product purchasable — stated on screen, because it
 * is the single most consequential edit here." So a price change confirms
 * (§6.3) with the consequence in words, and the audit records it as
 * `variant.price.set`.
 *
 * One variant is edited at a time (`?edit=<id>`), so a refused or unconfirmed
 * submit can carry its values back through the query string without
 * ambiguity. Adding a variant creates its stock item too, at zero.
 */

import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/server/auth/session';
import {
  PRODUCT_STATUSES,
  createVariant,
  getAdminProduct,
  updateVariant,
  type ProductStatus,
} from '@/lib/server/admin/products';
import { explainRefusal } from '@/lib/server/admin/refusal';
import { paiseToRupees, rupees, rupeesToPaise } from '../../../format';
import {
  backTo,
  carry,
  checked,
  initial,
  one,
  optionalText,
  prefilled,
  readNotice,
  text,
  type SearchParams,
} from '../../../form';
import { ConfirmNotice, Notices } from '../../../notices';
import shell from '../../../admin.module.css';
import ui from '../../../screen.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Price and variants' };

const EDIT_FIELDS = ['sku', 'name', 'price', 'netQuantity', 'status'] as const;
const ADD_FIELDS = ['newSku', 'newName', 'newPrice', 'newNetQuantity'] as const;

function priceConsequence(from: number | null, to: number | null): string | null {
  if (from === to) return null;
  if (from === null && to !== null) {
    return `Setting a price of ${rupees(to)} makes this product purchasable immediately, if it is active and in stock.`;
  }
  if (from !== null && to === null) {
    return `Removing the price (was ${rupees(from)}) takes this product off sale. It stays visible on the shop as "price to be confirmed".`;
  }
  return `Changing the price from ${rupees(from!)} to ${rupees(to!)} applies to every new order. The shop shows it within the hour; anything already in a cart is re-quoted at checkout.`;
}

async function saveVariant(formData: FormData) {
  'use server';
  const session = await requireAdmin();
  const productId = text(formData, 'productId');
  const variantId = text(formData, 'variantId');
  const path = `/admin/products/${productId}/variants`;
  const carried = carry(formData, EDIT_FIELDS);
  carried.set('edit', variantId);

  const product = await getAdminProduct(productId);
  const current = product?.variants.find((v) => v.id === variantId);
  if (!product || !current) notFound();

  const price = rupeesToPaise(text(formData, 'price'));
  const consequence = Number.isNaN(price) ? null : priceConsequence(current.pricePaise, price);
  if (consequence && !checked(formData, 'confirm')) {
    redirect(backTo(path, { confirm: true, carry: carried }));
  }

  let refused: string | null = null;
  try {
    await updateVariant(
      session,
      variantId,
      {
        sku: text(formData, 'sku').toUpperCase(),
        name: optionalText(formData, 'name'),
        pricePaise: price,
        netQuantity: text(formData, 'netQuantity'),
        status: text(formData, 'status') as ProductStatus,
      },
      text(formData, 'updatedAt')
    );
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused) redirect(backTo(path, { refused, carry: carried }));

  revalidatePath('/', 'layout');
  const done = new URLSearchParams({ edit: variantId });
  redirect(
    backTo(path, {
      done: consequence
        ? 'Saved. The price change is recorded and reaches the shop within the hour.'
        : 'Saved.',
      carry: done,
    })
  );
}

async function addVariant(formData: FormData) {
  'use server';
  const session = await requireAdmin();
  const productId = text(formData, 'productId');
  const path = `/admin/products/${productId}/variants`;
  const carried = carry(formData, ADD_FIELDS);
  carried.set('add', '1');

  let refused: string | null = null;
  let created: { variantId: string } | null = null;
  try {
    created = await createVariant(session, productId, {
      sku: text(formData, 'newSku').toUpperCase(),
      name: optionalText(formData, 'newName'),
      netQuantity: text(formData, 'newNetQuantity'),
      pricePaise: rupeesToPaise(text(formData, 'newPrice')),
    });
  } catch (e) {
    refused = explainRefusal(e);
    if (refused === null) throw e;
  }
  if (refused || !created) redirect(backTo(path, { refused: refused ?? undefined, carry: carried }));

  revalidatePath('/', 'layout');
  redirect(
    backTo(path, {
      done: 'Variant added with an empty stock item. Count its stock on the Inventory page before it can sell.',
      carry: new URLSearchParams({ edit: created.variantId }),
    })
  );
}

export default async function VariantsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const p = await getAdminProduct(id);
  if (!p) notFound();

  const notice = readNotice(sp);
  const editId = one(sp, 'edit') ?? (p.variants.length === 1 ? p.variants[0].id : undefined);
  const editing = p.variants.find((v) => v.id === editId) ?? null;
  const adding = one(sp, 'add') === '1' || p.variants.length === 0;
  const v = (name: string, fallback: string) => initial(sp, name, fallback);

  // An emptied price field is not carried back at all (carry() skips empty
  // values), so "absent" means "cleared" here and rupeesToPaise('') is null.
  const pendingPrice =
    editing && notice.confirm ? rupeesToPaise(prefilled(sp, 'price') ?? '') : Number.NaN;
  const confirmText =
    editing && !Number.isNaN(pendingPrice) ? priceConsequence(editing.pricePaise, pendingPrice) : null;

  return (
    <>
      <h1 className={shell.pageTitle}>{p.name}: price and variants</h1>
      <p className={shell.pageIntro}>
        A product can be bought only when its variant has a price and stock.
        Setting a price here makes it purchasable at once, so a price change
        asks you to confirm. <Link href={`/admin/products/${p.id}`}>Edit the product</Link>
      </p>

      <Notices notice={notice} />

      {p.variants.length > 0 ? (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">SKU</th>
                <th scope="col">Name</th>
                <th scope="col">Net quantity</th>
                <th scope="col" className={ui.num}>Price</th>
                <th scope="col" className={ui.num}>Available</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className={ui.srOnly}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {p.variants.map((variant) => (
                <tr key={variant.id}>
                  <td className={ui.primaryCell}>{variant.sku}</td>
                  <td className={ui.muted}>{variant.name ?? p.name}</td>
                  <td>{variant.netQuantity}</td>
                  <td className={ui.num}>
                    {variant.pricePaise === null ? (
                      <span className={`${ui.badge} ${ui.badgeAccent}`}>No price</span>
                    ) : (
                      rupees(variant.pricePaise)
                    )}
                  </td>
                  <td className={ui.num}>{variant.availability}</td>
                  <td>
                    <span className={`${ui.badge} ${variant.status === 'active' ? ui.badgeStrong : ''}`}>
                      {variant.status}
                    </span>
                  </td>
                  <td className={ui.rowActions}>
                    {editing?.id === variant.id ? (
                      <span className={ui.muted}>Editing below</span>
                    ) : (
                      <Link className={ui.link} href={`/admin/products/${p.id}/variants?edit=${variant.id}`}>
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={ui.empty}>This product has no variant, so nothing can be bought. Add one below.</p>
      )}

      {editing ? (
        <section className={ui.section} style={{ marginTop: 28 }}>
          <h2 className={ui.sectionTitle}>Edit {editing.sku}</h2>
          {confirmText ? <ConfirmNotice>{confirmText} Submit again to confirm.</ConfirmNotice> : null}
          <form className={ui.form} action={saveVariant}>
            <input type="hidden" name="productId" value={p.id} />
            <input type="hidden" name="variantId" value={editing.id} />
            <input type="hidden" name="updatedAt" value={editing.updatedAt.toISOString()} />
            {confirmText ? <input type="hidden" name="confirm" value="1" /> : null}

            <label className={ui.field}>
              <span className={ui.label}>Price, in rupees</span>
              <span className={ui.hint}>
                {editing.pricePaise === null
                  ? 'No price yet, so this cannot be bought. Setting one makes it purchasable.'
                  : `Currently ${rupees(editing.pricePaise)}. Empty it to take the product off sale.`}
              </span>
              <input className={ui.input} type="number" name="price" min={0} step={1} defaultValue={v('price', paiseToRupees(editing.pricePaise))} autoFocus />
            </label>

            <div className={ui.fieldRow}>
              <label className={ui.field}>
                <span className={ui.label}>SKU</span>
                <input className={ui.input} name="sku" required maxLength={40} pattern="[A-Za-z0-9]+(-[A-Za-z0-9]+)*" defaultValue={v('sku', editing.sku)} />
              </label>
              <label className={ui.field}>
                <span className={ui.label}>Net quantity</span>
                <input className={ui.input} name="netQuantity" required maxLength={40} defaultValue={v('netQuantity', editing.netQuantity)} />
              </label>
            </div>

            <div className={ui.fieldRow}>
              <label className={ui.field}>
                <span className={ui.label}>Variant name</span>
                <span className={ui.hint}>Optional. Only needed when a product has more than one variant.</span>
                <input className={ui.input} name="name" maxLength={80} defaultValue={v('name', editing.name ?? '')} />
              </label>
              <label className={ui.field}>
                <span className={ui.label}>Status</span>
                <span className={ui.hint}>Only an active variant can be bought.</span>
                <select className={ui.select} name="status" defaultValue={v('status', editing.status)}>
                  {PRODUCT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={ui.actions}>
              <button className={ui.primary} type="submit">
                {confirmText ? 'Yes, change the price' : 'Save'}
              </button>
              <Link className={ui.link} href={`/admin/products/${p.id}/variants`}>
                Cancel
              </Link>
            </div>
          </form>
        </section>
      ) : null}

      <section className={ui.section} style={{ marginTop: 28 }}>
        {adding ? (
          <>
            <h2 className={ui.sectionTitle}>Add a variant</h2>
            <form className={ui.form} action={addVariant}>
              <input type="hidden" name="productId" value={p.id} />
              <div className={ui.fieldRow}>
                <label className={ui.field}>
                  <span className={ui.label}>SKU</span>
                  <input className={ui.input} name="newSku" required maxLength={40} pattern="[A-Za-z0-9]+(-[A-Za-z0-9]+)*" defaultValue={v('newSku', '')} />
                </label>
                <label className={ui.field}>
                  <span className={ui.label}>Net quantity</span>
                  <input className={ui.input} name="newNetQuantity" required maxLength={40} defaultValue={v('newNetQuantity', '')} />
                </label>
              </div>
              <div className={ui.fieldRow}>
                <label className={ui.field}>
                  <span className={ui.label}>Variant name</span>
                  <span className={ui.hint}>Optional, e.g. "100 g tin".</span>
                  <input className={ui.input} name="newName" maxLength={80} defaultValue={v('newName', '')} />
                </label>
                <label className={ui.field}>
                  <span className={ui.label}>Price, in rupees</span>
                  <span className={ui.hint}>Leave empty if not confirmed.</span>
                  <input className={ui.input} type="number" name="newPrice" min={0} step={1} defaultValue={v('newPrice', '')} />
                </label>
              </div>
              <div className={ui.actions}>
                <button className={ui.primary} type="submit">
                  Add variant
                </button>
                {p.variants.length > 0 ? (
                  <Link className={ui.link} href={`/admin/products/${p.id}/variants`}>
                    Cancel
                  </Link>
                ) : null}
              </div>
            </form>
          </>
        ) : (
          <Link className={`${ui.secondary} ${ui.small}`} href={`/admin/products/${p.id}/variants?add=1`}>
            Add a variant
          </Link>
        )}
      </section>
    </>
  );
}
