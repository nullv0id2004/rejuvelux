import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit is used to GENERATE SQL only (`npx drizzle-kit generate`).
 * Migrations are applied through the Supabase MCP so Supabase's migration
 * history stays authoritative — decision of 27 Aug 2026, data-model.md header.
 * dbCredentials exist for `drizzle-kit generate` alone, which never connects;
 * anything that would connect (push, migrate, studio) is not part of the flow.
 */
export default defineConfig({
  schema: './lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
});
