/**
 * The single database client. Everything in lib/server imports `db` from here;
 * nothing else in the app may open a connection (data-model.md §9.1).
 *
 * Connects to Supabase through the transaction-mode pooler, which is what
 * Vercel's request-scoped functions need. Two consequences, both deliberate:
 *   - `prepare: false` — transaction pooling cannot hold prepared statements
 *     across requests;
 *   - transactions still work: a transaction holds one pooled connection for
 *     its duration, which is exactly what the reservation path's SELECT ...
 *     FOR UPDATE requires (architecture.md §2, race 1).
 *
 * DATABASE_URL lives in .env.local (gitignored) and Vercel env settings —
 * never in this repo. Fails loudly if absent: a silent fallback would be a
 * storefront quietly serving nothing.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Add it to apps/web/.env.local (Supabase → Connect → Transaction pooler URI).'
  );
}

/** One postgres-js instance per process; Next.js reuses the module across requests. */
const client = postgres(url, { prepare: false });

export const db = drizzle(client, { schema });
export type Db = typeof db;
/** A transaction handle, as the reservation path receives it. */
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];
