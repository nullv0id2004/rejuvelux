/**
 * Refusals — features/admin.md §5 ("Refused", "Stale") and §6.5 ("Refusals
 * explain").
 *
 * Every domain error that a screen can show becomes a sentence a non-developer
 * can act on: "Stock cannot go below the 3 units currently reserved for open
 * orders", never `inventory_level_no_oversell_check`.
 *
 * Two kinds. `RefusedError` is raised deliberately by the admin domain when a
 * rule is broken before the database is touched. `explainRefusal()` also
 * translates the constraint violations that reach Postgres anyway, so the
 * CHECKs and UNIQUE indexes stay the backstop and the screen still speaks.
 */

/** A mutation the domain layer declined, with the reason already in words. */
export class RefusedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefusedError';
  }
}

/**
 * The row changed under the editor since the form loaded (features/admin.md
 * §5). Detected by comparing `updated_at`; the edit is refused and the form is
 * re-presented with the current values rather than overwriting silently.
 */
export class StaleError extends RefusedError {
  constructor() {
    super(
      'This record changed while you were editing it. The current values are shown; check them and try again.'
    );
    this.name = 'StaleError';
  }
}

/**
 * Compare a form's snapshot of `updated_at` with the row as it is now, under
 * whatever lock the caller holds. Millisecond precision on both sides: the
 * driver parses timestamptz to a JS Date, and the form carried that Date's
 * ISO string back.
 */
export function assertNotStale(current: Date, expectedIso: string | null | undefined): void {
  if (!expectedIso) throw new StaleError();
  const expected = new Date(expectedIso);
  if (Number.isNaN(expected.getTime()) || expected.getTime() !== current.getTime()) {
    throw new StaleError();
  }
}

const CONSTRAINT_SENTENCES: Record<string, string> = {
  inventory_level_no_oversell_check:
    'Stock cannot go below the quantity currently reserved for open orders.',
  inventory_level_stocked_check: 'Stock cannot be negative.',
  product_slug_unique: 'Another product already uses that slug. Slugs must be unique.',
  product_variant_sku_unique: 'Another variant already uses that SKU. SKUs must be unique.',
  inventory_item_sku_unique: 'An inventory item with that SKU already exists.',
  product_territory_check: 'Territory must be FOCUS, ELEGANCE, LEGACY or none.',
  product_status_check: 'Status must be draft, active or retired.',
  product_variant_status_check: 'Status must be draft, active or retired.',
  product_variant_price_check: 'A price cannot be negative.',
  admin_user_email_unique: 'That address already belongs to an admin user.',
  app_user_email_unique: 'An account with that address already exists.',
  admin_user_role_check: 'Role must be owner or staff.',
  admin_user_status_check: 'Status must be active or disabled.',
  order_event_type_check: 'That is not a recognised order event.',
};

/**
 * The sentence for an error, or null when it is a bug rather than a refusal.
 * A null means the caller should let the error surface loudly
 * (conventions.md, Errors: expected outcomes are values, bugs abort).
 */
export function explainRefusal(e: unknown): string | null {
  if (e instanceof RefusedError) return e.message;

  // postgres-js surfaces the SQLSTATE and constraint name on the driver error.
  // Drizzle wraps that in a DrizzleQueryError whose own `message` is the failed
  // SQL, so the chain is walked to the driver error rather than read at one
  // level — found the hard way in stage 2, where a one-level read fell through
  // to a 500.
  const pg = driverError(e);
  if (pg?.code === '23505' || pg?.code === '23514') {
    const name =
      pg.constraint_name ??
      Object.keys(CONSTRAINT_SENTENCES).find((c) => (pg.message ?? '').includes(c));
    if (name && CONSTRAINT_SENTENCES[name]) return CONSTRAINT_SENTENCES[name];
    return pg.code === '23505'
      ? 'That value is already in use.'
      : 'The database refused that value.';
  }
  return null;
}

type PgError = { code?: string; constraint_name?: string; message?: string };

/** The first error in the `cause` chain that carries a SQLSTATE, or null. */
function driverError(e: unknown): PgError | null {
  let current: unknown = e;
  for (let depth = 0; depth < 6 && current && typeof current === 'object'; depth++) {
    const candidate = current as PgError & { cause?: unknown };
    if (typeof candidate.code === 'string') return candidate;
    current = candidate.cause;
  }
  return null;
}
