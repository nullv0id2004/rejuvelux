/**
 * Exit test for features/checkout.md — HTTP against the dev server for
 * behaviour, direct DB for the assertions HTTP cannot see (reservations,
 * events, cart status), and the pure fold exercised as a unit.
 *
 * Run (dev server on 3315): npx tsx --env-file=.env.local scripts/checkout-api-test.ts
 * Self-cleaning: releases reservations, deletes its orders and carts,
 * restores every price and stock count it touched.
 */

import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import {
  cart,
  inventoryItem,
  inventoryLevel,
  order,
  orderEvent,
  orderLine,
  productVariant,
  reservation,
} from '../lib/server/db/schema';
import { deriveOrderState } from '../lib/server/orders/state';
import { releaseReservations } from '../lib/server/inventory/reserve';

const BASE = process.env.BASE_URL ?? 'http://localhost:3315';

let failures = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`  PASS  ${name}`);
  else {
    failures++;
    console.error(`  FAIL  ${name}`, detail ?? '');
  }
}

/* --------------------------------------------------------- HTTP helpers -- */

interface Wire {
  orderId?: string;
  orderNumber?: string;
  subtotalPaise?: number;
  totalPaise?: number;
  state?: string;
  error?: string;
  message?: string;
  cartId?: string | null;
  lines?: { name?: string; slug?: string; lineId?: string; wasPaise?: number; nowPaise?: number; unitPricePaise?: number; quantity?: number }[];
  products?: string[];
}

async function api(
  method: string,
  path: string,
  cookie: string | null,
  body?: unknown
): Promise<{ status: number; json: Wire; setCookie: string | null }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return {
    status: res.status,
    json: (await res.json()) as Wire,
    setCookie: res.headers.get('set-cookie'),
  };
}

/** Build a cart over HTTP; returns its cookie. */
async function buildCart(items: { slug: string; quantity: number }[]): Promise<string> {
  let cookie: string | null = null;
  for (const item of items) {
    const r = await api('POST', '/api/cart/lines', cookie, item);
    if (r.status !== 201) throw new Error(`cart build failed: ${JSON.stringify(r.json)}`);
    if (r.setCookie) cookie = r.setCookie.split(';')[0];
  }
  if (!cookie) throw new Error('no cart cookie');
  return cookie;
}

const GOOD_INPUT = {
  contact: { email: 'checkout-test@invalid.local', phone: '9876543210' },
  shipping: {
    name: 'Checkout Test',
    line1: '1 Test Lane',
    city: 'Guwahati',
    state: 'Assam',
    pincode: '781001',
  },
};

/* ---------------------------------------------------------------- main ---*/

async function main() {
  /* §2.6 — the fold, as a pure unit */
  const happy = deriveOrderState(
    ['placed', 'payment_captured', 'shipped', 'delivered'].map((type) => ({ type: type as never }))
  );
  check('fold: happy path ends delivered, nothing rejected', happy.state === 'delivered' && happy.rejected.length === 0);
  const refund = deriveOrderState([{ type: 'placed' }, { type: 'payment_captured' }, { type: 'refunded' }]);
  check('fold: refund path ends refunded', refund.state === 'refunded' && refund.rejected.length === 0);
  const fail = deriveOrderState([{ type: 'placed' }, { type: 'payment_failed' }, { type: 'cancelled' }]);
  check('fold: failure path ends cancelled', fail.state === 'cancelled' && fail.rejected.length === 0);
  const outOfOrder = deriveOrderState([{ type: 'placed' }, { type: 'shipped' }, { type: 'payment_captured' }, { type: 'shipped' }]);
  check(
    'fold: shipped-before-captured rejected, then applied in order',
    outOfOrder.state === 'shipped' && outOfOrder.rejected.length === 1 && outOfOrder.rejected[0].index === 1,
    outOfOrder
  );
  const zombie = deriveOrderState([{ type: 'placed' }, { type: 'payment_failed' }, { type: 'cancelled' }, { type: 'payment_captured' }]);
  check('fold: captured-after-cancelled rejected (race 3)', zombie.state === 'cancelled' && zombie.rejected.length === 1);

  /* snapshot stock for restoration */
  const items = await db.select().from(inventoryItem);
  const itemBySku = new Map(items.map((i) => [i.sku, i]));
  const levels = await db.select().from(inventoryLevel);
  const levelSnapshot = new Map(levels.map((l) => [l.inventoryItemId, { ...l }]));
  const [matchaVariant] = await db.select().from(productVariant).where(eq(productVariant.sku, 'RJ-MATCHA-50'));
  const matchaPrice = matchaVariant.pricePaise!;

  /*
   * Guard the baseline before touching it.
   *
   * The requote section below raises this price and the `finally` restores it —
   * but on 9 Sep 2026 the database became unreachable mid-run, so the restore
   * query failed too and the storefront served ₹1,099 instead of ₹999 for about
   * ninety minutes. A `finally` cannot help when the connection is gone.
   *
   * So the drift is caught on the NEXT run instead: refuse to start against a
   * price that is not the expected one, loudly, rather than layering another
   * mutation on top of a corrupted value and reporting a confusing failure.
   */
  const EXPECTED_MATCHA_PAISE = 99900;
  if (matchaPrice !== EXPECTED_MATCHA_PAISE) {
    console.error(
      [
        '',
        `REFUSING TO RUN: RJ-MATCHA-50 is ${matchaPrice} paise, expected ${EXPECTED_MATCHA_PAISE}.`,
        'A previous run probably died before restoring it — this test raises the price to',
        'exercise the requote path. Check the live price before continuing:',
        `  UPDATE product_variant SET price_paise = ${EXPECTED_MATCHA_PAISE} WHERE sku = 'RJ-MATCHA-50';`,
      ].join('\n')
    );
    process.exit(1);
  }

  const cleanup: { orderIds: string[]; cartIds: string[] } = { orderIds: [], cartIds: [] };
  const trackCart = (cookie: string) => {
    const id = cookie.split('=')[1];
    cleanup.cartIds.push(id);
    return id;
  };

  try {
    /* §2.1 — validation refusals */
    const noCart = await api('POST', '/api/checkout', null, GOOD_INPUT);
    check('no cart: 400 EMPTY_CART', noCart.status === 400 && noCart.json.error === 'EMPTY_CART');

    const vCookie = await buildCart([{ slug: 'assam-matcha', quantity: 1 }]);
    trackCart(vCookie);
    for (const [name, patch, expect] of [
      ['bad email', { contact: { ...GOOD_INPUT.contact, email: 'nope' } }, 'BAD_REQUEST'],
      ['bad phone', { contact: { ...GOOD_INPUT.contact, phone: '12345' } }, 'BAD_REQUEST'],
      ['bad pincode', { shipping: { ...GOOD_INPUT.shipping, pincode: '78100' } }, 'BAD_REQUEST'],
      ['gift message without isGift', { gift: { isGift: false, message: 'hello' } }, 'BAD_REQUEST'],
    ] as const) {
      const r = await api('POST', '/api/checkout', vCookie, { ...GOOD_INPUT, ...patch });
      check(`validation: ${name} → 400 ${expect}`, r.status === 400 && r.json.error === expect, r.json);
    }

    /* §2.3 — the happy path, verified down to the rows */
    const happyCookie = await buildCart([
      { slug: 'assam-matcha', quantity: 2 },
      { slug: 'assam-golden-tips', quantity: 1 },
    ]);
    const happyCartId = trackCart(happyCookie);
    const placed = await api('POST', '/api/checkout', happyCookie, {
      ...GOOD_INPUT,
      gift: { isGift: true, message: 'Earned.' },
    });
    check('place: 201', placed.status === 201, placed.json);
    check('place: order number RJ-#####', /^RJ-\d{5}$/.test(placed.json.orderNumber ?? ''), placed.json.orderNumber);
    check('place: totals 2×99900 + 499900 + 0', placed.json.totalPaise === 2 * 99900 + 499900);
    check('place: cookie cleared', (placed.setCookie ?? '').includes('rj_cart=;') || (placed.setCookie ?? '').toLowerCase().includes('max-age=0'), placed.setCookie);
    const orderId = placed.json.orderId!;
    cleanup.orderIds.push(orderId);

    const [cartAfter] = await db.select().from(cart).where(eq(cart.id, happyCartId));
    check('place: cart completed', cartAfter.status === 'completed');
    const events = await db.select().from(orderEvent).where(eq(orderEvent.orderId, orderId));
    check('place: exactly one event, placed', events.length === 1 && events[0].type === 'placed');
    const resRows = await db.select().from(reservation).where(eq(reservation.orderId, orderId));
    const matchaTin = itemBySku.get('INV-MATCHA-50')!;
    const goldTin = itemBySku.get('INV-GOLDEN-50')!;
    check(
      'place: reservations held — matcha 2, gold 1',
      resRows.length === 2 &&
        resRows.every((r) => r.state === 'held') &&
        resRows.find((r) => r.inventoryItemId === matchaTin.id)?.quantity === 2 &&
        resRows.find((r) => r.inventoryItemId === goldTin.id)?.quantity === 1,
      resRows
    );
    const [orderRow] = await db.select().from(order).where(eq(order.id, orderId));
    check('place: gift stored', orderRow.isGift === true && orderRow.giftMessage === 'Earned.');

    /* §2.5 — idempotency, sequential */
    const replay = await api('POST', '/api/checkout', happyCookie, GOOD_INPUT);
    check('idempotent: replay 200, same order number', replay.status === 200 && replay.json.orderNumber === placed.json.orderNumber, replay);
    const eventsAfter = await db.select().from(orderEvent).where(eq(orderEvent.orderId, orderId));
    const resAfter = await db.select().from(reservation).where(eq(reservation.orderId, orderId));
    check('idempotent: still one event, two reservations', eventsAfter.length === 1 && resAfter.length === 2);

    /* §2.5 — idempotency, concurrent double submit on a fresh cart */
    const raceCookie = await buildCart([{ slug: 'green-tea', quantity: 1 }]);
    const raceCartId = trackCart(raceCookie);
    const [r1, r2] = await Promise.all([
      api('POST', '/api/checkout', raceCookie, GOOD_INPUT),
      api('POST', '/api/checkout', raceCookie, GOOD_INPUT),
    ]);
    const okBoth = [r1, r2].filter((r) => r.status === 201 || r.status === 200);
    check('double submit: both succeed (one 201, one 200)', okBoth.length === 2 && [r1.status, r2.status].sort().join(',') === '200,201', [r1.status, r2.status]);
    check('double submit: same order number', r1.json.orderNumber === r2.json.orderNumber);
    const raceOrders = await db.select().from(order).where(eq(order.cartId, raceCartId));
    check('double submit: ONE order row', raceOrders.length === 1);
    cleanup.orderIds.push(raceOrders[0].id);

    /* §2.2 — re-quote */
    const rqCookie = await buildCart([{ slug: 'assam-matcha', quantity: 1 }]);
    trackCart(rqCookie);
    await db.update(productVariant).set({ pricePaise: matchaPrice + 10000 }).where(eq(productVariant.id, matchaVariant.id));
    const requoted = await api('POST', '/api/checkout', rqCookie, GOOD_INPUT);
    check(
      'requote: 409 REQUOTED with old and new price',
      requoted.status === 409 &&
        requoted.json.error === 'REQUOTED' &&
        requoted.json.lines?.[0]?.wasPaise === matchaPrice &&
        requoted.json.lines?.[0]?.nowPaise === matchaPrice + 10000,
      requoted.json
    );
    const resubmit = await api('POST', '/api/checkout', rqCookie, GOOD_INPUT);
    check('requote: knowing resubmit succeeds at the new price', resubmit.status === 201 && resubmit.json.subtotalPaise === matchaPrice + 10000, resubmit.json);
    cleanup.orderIds.push(resubmit.json.orderId!);
    await db.update(productVariant).set({ pricePaise: matchaPrice }).where(eq(productVariant.id, matchaVariant.id));

    /* §2.3 step 4 — out of stock rolls the whole placement back */
    const oosCookie = await buildCart([{ slug: 'assam-matcha', quantity: 5 }]);
    const oosCartId = trackCart(oosCookie);
    // choke the tin to 3 available
    const tinLevel = levelSnapshot.get(matchaTin.id)!;
    const inFlight = (await db.select().from(inventoryLevel).where(eq(inventoryLevel.inventoryItemId, matchaTin.id)))[0];
    await db
      .update(inventoryLevel)
      .set({ stockedQuantity: inFlight.reservedQuantity + 3 })
      .where(eq(inventoryLevel.inventoryItemId, matchaTin.id));
    const oos = await api('POST', '/api/checkout', oosCookie, GOOD_INPUT);
    check('out of stock: 409 naming Assam Matcha', oos.status === 409 && oos.json.error === 'OUT_OF_STOCK' && (oos.json.products ?? []).includes('Assam Matcha'), oos.json);
    const oosOrders = await db.select().from(order).where(eq(order.cartId, oosCartId));
    const [oosCart] = await db.select().from(cart).where(eq(cart.id, oosCartId));
    check('out of stock: no order row, cart still open', oosOrders.length === 0 && oosCart.status === 'open');
    await db
      .update(inventoryLevel)
      .set({ stockedQuantity: tinLevel.stockedQuantity })
      .where(eq(inventoryLevel.inventoryItemId, matchaTin.id));

    /* §2.1 — variant retired mid-cart */
    const [greenVariant] = await db.select().from(productVariant).where(eq(productVariant.sku, 'RJ-GREEN-200'));
    const uaCookie = await buildCart([{ slug: 'green-tea', quantity: 1 }]);
    trackCart(uaCookie);
    await db.update(productVariant).set({ status: 'retired' }).where(eq(productVariant.id, greenVariant.id));
    const ua = await api('POST', '/api/checkout', uaCookie, GOOD_INPUT);
    check('retired mid-cart: 409 UNAVAILABLE naming Green Tea', ua.status === 409 && ua.json.error === 'UNAVAILABLE' && ua.json.lines?.[0]?.name === 'Green Tea', ua.json);
    await db.update(productVariant).set({ status: 'active' }).where(eq(productVariant.id, greenVariant.id));
  } finally {
    /* restore the world */
    for (const oid of cleanup.orderIds) await releaseReservations(oid).catch(() => {});
    if (cleanup.orderIds.length) {
      await db.delete(reservation).where(inArray(reservation.orderId, cleanup.orderIds));
      await db.delete(orderEvent).where(inArray(orderEvent.orderId, cleanup.orderIds));
      await db.delete(orderLine).where(inArray(orderLine.orderId, cleanup.orderIds));
      await db.delete(order).where(inArray(order.id, cleanup.orderIds));
    }
    if (cleanup.cartIds.length) {
      await db.delete(cart).where(inArray(cart.id, cleanup.cartIds));
    }
    await db.update(productVariant).set({ pricePaise: matchaPrice }).where(eq(productVariant.id, matchaVariant.id));
    for (const [itemId, level] of levelSnapshot) {
      await db
        .update(inventoryLevel)
        .set({ stockedQuantity: level.stockedQuantity, reservedQuantity: level.reservedQuantity })
        .where(eq(inventoryLevel.inventoryItemId, itemId));
    }
    console.log('  cleanup: orders, carts, prices and stock restored');
  }

  /* independent verification that nothing leaked */
  const [audit] = await db
    .select({
      orders: sql<number>`(SELECT count(*)::int FROM "order")`,
      reservations: sql<number>`(SELECT count(*)::int FROM reservation)`,
      reserved: sql<number>`(SELECT coalesce(sum(reserved_quantity),0)::int FROM inventory_level)`,
    })
    .from(sql`(SELECT 1) AS one`);
  check('audit: zero orders, zero reservations, zero reserved stock', audit.orders === 0 && audit.reservations === 0 && audit.reserved === 0, audit);

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
