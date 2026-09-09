/**
 * Bootstrap the first admin owner — features/admin.md §8 stage 1.
 *
 * The chicken-and-egg this exists to break: stage 5's invite flow requires an
 * existing `owner` to send the invite, so the first one cannot be invited. It
 * is created here, deliberately and visibly, rather than by a hidden seed.
 *
 * **Rewritten for ADR-0012.** It used to read Supabase's `auth.users` and could
 * not set a password, because under ADR-0008 no password passed through our
 * code. Credentials now live in our own `app_user`, so this script finds or
 * creates that row and can set the password itself. That matters more than it
 * sounds: there is no password-reset email yet (R-78), so this is the only way
 * to recover an admin account.
 *
 * This is the ONE admin write that does not go through auditedMutation(),
 * because there is no admin_user to attribute it to yet. Every subsequent
 * mutation is audited. Noted here so the exception stays a documented one
 * rather than a gap someone finds later and assumes was an oversight.
 *
 * Usage:
 *   npm run bootstrap:owner -- <email> [name]
 *   ADMIN_BOOTSTRAP_PASSWORD='...' npm run bootstrap:owner -- <email> [name]
 *
 * PowerShell does not support an inline `VAR=x command` prefix. There, set it
 * first:
 *   $env:ADMIN_BOOTSTRAP_PASSWORD='...'; npm run bootstrap:owner -- <email>
 *   Remove-Item Env:\ADMIN_BOOTSTRAP_PASSWORD
 *
 * Idempotent: re-running promotes an existing row to `owner` rather than
 * failing, and sets the password only when one is supplied.
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../lib/server/db/client';
import { adminUser, appUser } from '../lib/server/db/schema';
import { hashPassword, validatePasswordStrength } from '../lib/server/auth/password';

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const name = process.argv[3]?.trim() || null;
  const wantedPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email) {
    console.error('Usage: npm run bootstrap:owner -- <email> [name]');
    console.error('Set ADMIN_BOOTSTRAP_PASSWORD to create or reset the password too.');
    process.exit(1);
  }

  if (wantedPassword) {
    const weak = validatePasswordStrength(wantedPassword);
    if (weak) {
      console.error(`ADMIN_BOOTSTRAP_PASSWORD rejected: ${weak}`);
      process.exit(1);
    }
  }

  /* 1. The credential row. Ours now, not Supabase's. --------------------- */

  const [found] = await db
    .select({ id: appUser.id, email: appUser.email, passwordHash: appUser.passwordHash })
    .from(appUser)
    .where(eq(appUser.email, email))
    .limit(1);

  let userId: string;

  if (!found) {
    if (!wantedPassword) {
      console.error(
        `No account with email ${email}.\n` +
          'Set ADMIN_BOOTSTRAP_PASSWORD to create one:\n' +
          `  ADMIN_BOOTSTRAP_PASSWORD='...' npm run bootstrap:owner -- ${email}`
      );
      process.exit(1);
    }
    const [created] = await db
      .insert(appUser)
      .values({
        email,
        passwordHash: await hashPassword(wantedPassword),
        // Verified on creation: this account is being made by someone with
        // database access, so an email round trip would prove nothing extra —
        // and there is no provider to send one with (R-78).
        emailVerifiedAt: new Date(),
      })
      .returning({ id: appUser.id });
    userId = created!.id;
    console.log(`Created the credential for ${email} and set its password.`);
  } else {
    userId = found.id;
    if (wantedPassword) {
      // Changing a password invalidates every live session. token_version is
      // what makes that true of ACCESS tokens, not merely refresh ones.
      await db
        .update(appUser)
        .set({
          passwordHash: await hashPassword(wantedPassword),
          tokenVersion: sql`${appUser.tokenVersion} + 1`,
          failedLoginCount: 0,
          lockedUntil: null,
          updatedAt: sql`now()`,
        })
        .where(eq(appUser.id, userId));
      console.log(
        `Set a new password for ${email}. Any existing sessions are now invalid, and any lockout is cleared.`
      );
    } else if (!found.passwordHash) {
      console.warn(
        `NOTE: ${email} has no password (Google-only). ` +
          'Set ADMIN_BOOTSTRAP_PASSWORD to add one.'
      );
    }
  }

  /* 2. The admin role. ---------------------------------------------------- */

  const existing = await db.select().from(adminUser).where(eq(adminUser.authUserId, userId));

  if (existing.length > 0) {
    const row = existing[0]!;
    if (row.role === 'owner' && row.status === 'active') {
      console.log(`Already an active owner: ${row.email} (${row.id}).`);
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
    .values({ authUserId: userId, email, name, role: 'owner', status: 'active' })
    .returning({ id: adminUser.id, email: adminUser.email, role: adminUser.role });

  console.log(`Created owner: ${created!.email} (${created!.id}), role ${created!.role}.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
