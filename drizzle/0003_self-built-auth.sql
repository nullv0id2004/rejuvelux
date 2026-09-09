CREATE TABLE "app_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"email_verified_at" timestamp with time zone,
	"token_version" integer DEFAULT 0 NOT NULL,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_user_email_lower_check" CHECK ("app_user"."email" = lower("app_user"."email")),
	CONSTRAINT "app_user_token_version_check" CHECK ("app_user"."token_version" >= 0),
	CONSTRAINT "app_user_failed_login_check" CHECK ("app_user"."failed_login_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "app_user_identity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_user_identity_provider_check" CHECK ("app_user_identity"."provider" IN ('google'))
);
--> statement-breakpoint
CREATE TABLE "refresh_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"audience" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"absolute_expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	"device_info" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_token_audience_check" CHECK ("refresh_token"."audience" IN ('customer','admin')),
	CONSTRAINT "refresh_token_window_check" CHECK ("refresh_token"."expires_at" <= "refresh_token"."absolute_expires_at")
);
--> statement-breakpoint
ALTER TABLE "app_user_identity" ADD CONSTRAINT "app_user_identity_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_user_email_unique" ON "app_user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "app_user_identity_provider_unique" ON "app_user_identity" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "app_user_identity_user_idx" ON "app_user_identity" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_token_hash_unique" ON "refresh_token" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "refresh_token_user_idx" ON "refresh_token" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_token_expiry_idx" ON "refresh_token" USING btree ("absolute_expires_at");
--> statement-breakpoint
-- ============================================================================
-- Hand-written tail. ADR-0012 replaces Supabase Auth with app_user; this is the
-- part drizzle-kit cannot generate, because it moves live data and rewrites two
-- cross-schema foreign keys.
--
-- 1. CARRY THE CREDENTIALS ACROSS, ids and all.
--
-- Preserving `id` is what makes this migration safe: customer.auth_user_id and
-- admin_user.auth_user_id already hold auth.users ids, so keeping the same
-- values means both columns stay valid and no row needs rewriting.
--
-- The password hash is portable rather than lost. Supabase Auth stores bcrypt;
-- verified on this database before writing this migration — 1 row, prefix
-- '$2a$', length 60 — and bcrypt is bcrypt, so the existing owner keeps the
-- password they already have. Without this they would be locked out: there is
-- no password-reset email to fall back on (R-78).
--
-- email is lowercased to satisfy app_user_email_lower_check. Rows without an
-- email are skipped — they cannot sign in by any path we are building.
INSERT INTO "app_user" ("id", "email", "password_hash", "email_verified_at", "created_at", "last_sign_in_at")
SELECT u.id,
       lower(u.email),
       u.encrypted_password,
       u.email_confirmed_at,
       u.created_at,
       u.last_sign_in_at
FROM auth.users u
WHERE u.email IS NOT NULL
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint

-- 2. REPOINT BOTH FOREIGN KEYS from auth.users to app_user.
--
-- The column names and the ON DELETE asymmetry are unchanged and deliberate
-- (features/accounts.md §6.4): a customer's orders must outlive their account,
-- so SET NULL; an admin identity with no credential behind it is a dead row,
-- so CASCADE — admin_action holds the durable record and RESTRICTs its actor.
ALTER TABLE "customer" DROP CONSTRAINT "customer_auth_user_fk";--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_auth_user_fk"
  FOREIGN KEY ("auth_user_id") REFERENCES "public"."app_user"("id") ON DELETE SET NULL;--> statement-breakpoint

ALTER TABLE "admin_user" DROP CONSTRAINT "admin_user_auth_user_fk";--> statement-breakpoint
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_auth_user_fk"
  FOREIGN KEY ("auth_user_id") REFERENCES "public"."app_user"("id") ON DELETE CASCADE;--> statement-breakpoint

-- 3. Deny-all RLS, as every other table (data-model.md §9.1). These three hold
-- credentials and live sessions, so the anon PostgREST surface must never see
-- them. The domain layer connects as postgres and is the only reader.
ALTER TABLE "app_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "app_user_identity" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "refresh_token" ENABLE ROW LEVEL SECURITY;
