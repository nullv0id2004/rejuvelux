/**
 * Exit test for Phase 1 — the catalogue on the database (`docs/roadmap.md` §5.1).
 *
 * Runs against the real database and a running dev server, because the thing
 * being proved is that the two agree. `lib/catalogue.ts` is `server-only` and
 * deliberately cannot be imported here — that guard is what stops a client
 * component pulling database credentials into a browser bundle — so the
 * rendered HTML is the observation point, exactly as a visitor sees it.
 *
 * Run (dev server on 3000):
 *   npm run test:catalogue
 *
 * Self-cleaning: the kit-availability section restores every stock level it
 * touches, and asserts the restoration before exiting.
 */

import { and, eq } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import {
  inventoryLevel,
  product,
  productVariant,
  variantInventoryItem,
} from '../lib/server/db/schema';
import { getVariantAvailability } from '../lib/server/inventory/availability';
import { BASE, requireServer } from './_server';


let pass = 0;
let fail = 0;
const check = (ok: boolean, label: string) => {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}`);
  }
};

const get = async (path: string) => {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  return { status: res.status, html: res.ok ? await res.text() : '' };
};

async function main() {
  await requireServer();
  /* 1. The database is the source of truth ------------------------------- */

  const rows = await db
    .select()
    .from(product)
    .innerJoin(productVariant, eq(productVariant.productId, product.id))
    .where(eq(product.status, 'active'));

  const slugs = rows.map((r) => r.product.slug).sort();
  check(rows.length === 5, `database holds 5 active products (got ${rows.length})`);

  const shop = await get('/shop');
  check(shop.status === 200, '/shop renders');
  for (const s of slugs) {
    check(shop.html.includes(`/shop/${s}`), `/shop links ${s}`);
  }

  /* 2. Real prices, and no dummy ----------------------------------------- */

  check(!shop.html.includes('1,250'), 'the dummy ₹1,250 appears nowhere');

  const priced = rows.filter((r) => r.product_variant.pricePaise !== null);
  for (const r of priced) {
    const rupees = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(r.product_variant.pricePaise! / 100);
    check(shop.html.includes(rupees), `${r.product.slug} shows its real price ${rupees}`);
  }

  /* 3. Unpriced products are visible but not purchasable (R-04) ---------- */

  const unpriced = rows.filter((r) => r.product_variant.pricePaise === null);
  check(unpriced.length === 2, `2 products are unpriced (got ${unpriced.length})`);
  for (const r of unpriced) {
    const page = await get(`/shop/${r.product.slug}`);
    check(page.status === 200, `${r.product.slug} still has a page`);
    check(
      page.html.includes('Price to be confirmed'),
      `${r.product.slug} renders as unpriced, not as zero`
    );
    check(
      page.html.includes('Not yet on sale'),
      `${r.product.slug} cannot be added to the cart`
    );
  }

  /* 4. Withheld products are absent (R-52, and ube's missing sign-off) ---- */

  for (const slug of ['ctc', 'ube']) {
    const page = await get(`/shop/${slug}`);
    check(page.status === 404, `/shop/${slug} is 404 — withheld, not rendered`);
  }
  check(!shop.html.includes('>CTC Tea<'), '/shop does not list CTC');
  check(!shop.html.includes('>Ube<'), '/shop does not list Ube');

  /* 5. Old slugs are gone ------------------------------------------------- */

  for (const slug of ['silver', 'matcha', 'golden', 'green']) {
    const page = await get(`/shop/${slug}`);
    check(page.status === 404, `pre-Phase-1 slug /shop/${slug} is 404`);
  }

  /* 6. The kit is only as available as its scarcest component ------------- */

  const kit = rows.find((r) => r.product.slug === 'matcha-ritual-set');
  if (!kit) {
    check(false, 'the Ritual Set exists');
  } else {
    const kitVariant = kit.product_variant.id;
    const links = await db
      .select()
      .from(variantInventoryItem)
      .where(eq(variantInventoryItem.variantId, kitVariant));
    check(links.length === 6, `the Ritual Set has 6 components (got ${links.length})`);

    const before = (await getVariantAvailability([kitVariant])).get(kitVariant) ?? 0;
    check(before > 0, `the set is available before the test (${before})`);

    // Choke exactly one component and prove the whole set follows it to zero.
    const victim = links[0]!;
    const [level] = await db
      .select()
      .from(inventoryLevel)
      .where(eq(inventoryLevel.inventoryItemId, victim.inventoryItemId));
    const original = level!.stockedQuantity;

    await db
      .update(inventoryLevel)
      .set({ stockedQuantity: 0 })
      .where(eq(inventoryLevel.inventoryItemId, victim.inventoryItemId));

    const during = (await getVariantAvailability([kitVariant])).get(kitVariant) ?? -1;
    check(
      during === 0,
      `one component at zero takes the whole set to zero (got ${during})`
    );

    await db
      .update(inventoryLevel)
      .set({ stockedQuantity: original })
      .where(eq(inventoryLevel.inventoryItemId, victim.inventoryItemId));

    const after = (await getVariantAvailability([kitVariant])).get(kitVariant) ?? -1;
    check(after === before, `stock restored to ${before} (got ${after})`);
  }

  /* 7. Cups are derived, never invented ---------------------------------- */

  const golden = rows.find((r) => r.product.slug === 'assam-golden-tips');
  if (golden) {
    const page = await get('/shop/assam-golden-tips');
    check(
      page.html.includes(golden.product_variant.netQuantity),
      `net quantity comes from the database (${golden.product_variant.netQuantity})`
    );
    // 50 g at 3 g per cup = 16, floored. Derived, so it cannot drift.
    check(page.html.includes('≈ 16'), 'cups are derived from net quantity ÷ leaf');
  }

  console.log(`\n${fail === 0 ? 'All checks passed.' : `${fail} FAILED`}  (${pass} passed)`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
