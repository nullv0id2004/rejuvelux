/**
 * HTTP exit test for features/cart.md — drives the real Route Handlers over a
 * running dev server (default http://localhost:3000; override with BASE_URL).
 *
 * Covers §2 and §4 of the doc: read-never-creates, the add gates (NULL price,
 * unknown slug, the cap), atomic concurrent merge, price snapshot, PATCH/
 * DELETE scoping, and the garbage-cookie path. Cleans up by deleting its
 * lines; the cart row itself remains (rows are cheap, doc §9) — its id is
 * printed for the record.
 *
 * Run: npx tsx scripts/cart-api-test.ts
 */

import { BASE, requireServer } from './_server';


let failures = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`  PASS  ${name}`);
  else {
    failures++;
    console.error(`  FAIL  ${name}`, detail ?? '');
  }
}

let cookie = '';
function captureCookie(res: Response) {
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
}

/** Wire shapes, as the routes emit them. */
interface LineWire {
  lineId: string;
  slug: string;
  quantity: number;
  unitPricePaise: number;
  stockState: string;
}
interface CartWire {
  cartId: string | null;
  lines: LineWire[];
  subtotalPaise: number;
  error?: string;
  message?: string;
}

async function api(
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; json: CartWire }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  captureCookie(res);
  return { status: res.status, json: await res.json() };
}

async function main() {
  await requireServer();
  // §2.1 — reads never create
  const empty = await api('GET', '/api/cart');
  check('GET without cookie: empty shape', empty.status === 200 && empty.json.cartId === null);
  check('GET without cookie: sets no cookie', cookie === '');

  // §2.2 — add, snapshot, merge
  const add1 = await api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 2 });
  check('add: 201 and cookie set', add1.status === 201 && cookie.startsWith('rj_cart='), {
    status: add1.status,
    cookie,
  });
  check(
    'add: one line, qty 2, snapshot 99900',
    add1.json.lines.length === 1 &&
      add1.json.lines[0].quantity === 2 &&
      add1.json.lines[0].unitPricePaise === 99900,
    add1.json.lines
  );
  check('add: stockState reported', add1.json.lines[0].stockState === 'available');

  const add2 = await api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 3 });
  check(
    'merge: same slug again → one line, qty 5',
    add2.json.lines.length === 1 && add2.json.lines[0].quantity === 5,
    add2.json.lines
  );

  // §4 — two tabs at once: atomic merge, still one line
  await Promise.all([
    api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 1 }),
    api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 1 }),
  ]);
  const afterRace = await api('GET', '/api/cart');
  check(
    'concurrent merge: one line, qty 7',
    afterRace.json.lines.length === 1 && afterRace.json.lines[0].quantity === 7,
    afterRace.json.lines
  );

  // §2.2 — the cap refuses whole, never clamps
  const overCap = await api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 4 });
  check('cap: merge to 11 refused 409 QUANTITY_LIMIT', overCap.status === 409 && overCap.json.error === 'QUANTITY_LIMIT', overCap);
  const afterCap = await api('GET', '/api/cart');
  check('cap: quantity unchanged at 7', afterCap.json.lines[0].quantity === 7);

  // §2.2 — invariant 9: NULL price never sold
  const nullPrice = await api('POST', '/api/cart/lines', { slug: 'matcha-ritual-set', quantity: 1 });
  check(
    'NULL price: 409 NOT_PURCHASABLE',
    nullPrice.status === 409 && nullPrice.json.error === 'NOT_PURCHASABLE',
    nullPrice
  );
  const unknown = await api('POST', '/api/cart/lines', { slug: 'no-such-tea', quantity: 1 });
  check('unknown slug: 404 NOT_FOUND', unknown.status === 404 && unknown.json.error === 'NOT_FOUND');
  const badQty = await api('POST', '/api/cart/lines', { slug: 'assam-matcha', quantity: 0 });
  check('quantity 0 on add: 400 BAD_REQUEST', badQty.status === 400 && badQty.json.error === 'BAD_REQUEST');

  // subtotal arithmetic — snapshot prices only
  const addGold = await api('POST', '/api/cart/lines', { slug: 'assam-golden-tips', quantity: 1 });
  check(
    'subtotal: 7×99900 + 1×499900',
    addGold.json.subtotalPaise === 7 * 99900 + 499900,
    addGold.json.subtotalPaise
  );

  // §2.4 — PATCH and scoping
  const matchaLine = addGold.json.lines.find((l: LineWire) => l.slug === 'assam-matcha');
  const goldLine = addGold.json.lines.find((l: LineWire) => l.slug === 'assam-golden-tips');
  if (!matchaLine || !goldLine) {
    throw new Error('fixture lines missing from cart view — earlier checks should have failed');
  }

  const patch10 = await api('PATCH', `/api/cart/lines/${matchaLine.lineId}`, { quantity: 10 });
  check(
    'PATCH to 10: ok',
    patch10.status === 200 &&
      patch10.json.lines.find((l: LineWire) => l.slug === 'assam-matcha')?.quantity === 10
  );
  const patch11 = await api('PATCH', `/api/cart/lines/${matchaLine.lineId}`, { quantity: 11 });
  check('PATCH to 11: 409', patch11.status === 409 && patch11.json.error === 'QUANTITY_LIMIT');
  const foreign = await api('PATCH', `/api/cart/lines/00000000-0000-4000-8000-000000000000`, { quantity: 1 });
  check('PATCH foreign line id: 404', foreign.status === 404);

  const patch0 = await api('PATCH', `/api/cart/lines/${matchaLine.lineId}`, { quantity: 0 });
  check(
    'PATCH to 0: line removed',
    patch0.status === 200 && !patch0.json.lines.some((l: LineWire) => l.slug === 'assam-matcha')
  );
  const del = await api('DELETE', `/api/cart/lines/${goldLine.lineId}`);
  check('DELETE: cart empty, subtotal 0', del.json.lines.length === 0 && del.json.subtotalPaise === 0);

  // §2.1 — garbage cookie reads as empty
  const kept = cookie;
  cookie = 'rj_cart=00000000-0000-4000-8000-000000000000';
  const garbage = await api('GET', '/api/cart');
  check('garbage cookie: empty shape', garbage.json.cartId === null);
  cookie = kept;

  const finalView = await api('GET', '/api/cart');
  console.log(`  note: test cart ${finalView.json.cartId} left empty (rows are cheap, doc §9)`);

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
