/**
 * Bootstrap the first admin owner — features/admin.md §8 stage 1.
 *
 * The chicken-and-egg this exists to break: stage 5's invite flow requires an
 * existing `owner` to send the invite, so the first one cannot be invited. It
 * is created here, deliberately and visibly, rather than by a hidden seed.
 *
 * Prerequisite: the person already exists in Supabase Auth (Dashboard →
 * Authentication → Users). This script does NOT create auth accounts — no
 * password ever passes through our code, which is ADR-0008's whole point.
 *
 * This is the ONE admin write that does not go through auditedMutation(),
 * because there is no admin_user to attribute it to yet. Every subsequent
 * mutation is audited. Noted here so the exception is a documented one rather
 * than a gap someone finds later and assumes was an oversight.
 *
 * Usage, from apps/web:
 *   npx tsx --env-file=.env.local scripts/bootstrap-owner.ts <email> [name]
 *
 * Idempotent: re-running promotes an existing row to `owner` rather than
 * failing, so it is safe on a database that has been partly set up.
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import { adminUser } from '../lib/server/db/schema';

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const name = process.argv[3]?.trim() || null;

  if (!email) {
    console.error('Usage: tsx --env-file=.env.local scripts/bootstrap-owner.ts <email> [name]');
    process.exit(1);
  }

  // auth.users is Supabase's, outside our Drizzle schema — raw select is the
  // honest way to read it, and it is a read, not a write.
  const found = await db.execute<{ id: string; email: string; confirmed: string | null }>(
    sql`SELECT id, email, email_confirmed_at AS confirmed
        FROM auth.users WHERE lower(email) = ${email} LIMIT 1`
  );
  const authUser = found[0];

  if (!authUser) {
    console.error(
      `No Supabase Auth user with email ${email}.\n` +
        'Create one first: Dashboard → Authentication → Users → Add user.\n' +
        'This script links an existing auth identity to an admin role; it does not create accounts.'
    );
    process.exit(1);
  }
  if (!authUser.confirmed) {
    console.warn(
      `WARNING: ${email} exists but its email is not confirmed. ` +
        'Supabase may refuse sign-in until it is.'
    );
  }

  const existing = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.authUserId, authUser.id));

  if (existing.length > 0) {
    const row = existing[0];
    if (row.role === 'owner' && row.status === 'active') {
      console.log(`Already an active owner: ${row.email} (${row.id}). Nothing to do.`);
      process.exit(0);
    }
    await db
      .update(adminUser)
      .set({ role: 'owner', status: 'active', updatedAt: sql`now()` })
      .where(eq(adminUser.id, row.id));
    console.log(`Promoted ${row.email} to active owner (was ${row.role}/${row.status}).`);
    process.exit(0);
  }

  const [created] = await db
    .insert(adminUser)
    .values({
      authUserId: authUser.id,
      email: authUser.email,
      name,
      role: 'owner',
      status: 'active',
    })
    .returning({ id: adminUser.id, email: adminUser.email, role: adminUser.role });

  console.log(`Created owner: ${created.email} (${created.id}), role ${created.role}.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
