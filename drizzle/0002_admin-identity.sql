CREATE TABLE "admin_action" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_action_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"admin_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_invite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"invited_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_invite_role_check" CHECK ("admin_invite"."role" IN ('owner','staff'))
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'staff' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_user_role_check" CHECK ("admin_user"."role" IN ('owner','staff')),
	CONSTRAINT "admin_user_status_check" CHECK ("admin_user"."status" IN ('active','disabled'))
);
--> statement-breakpoint
ALTER TABLE "admin_action" ADD CONSTRAINT "admin_action_admin_user_id_admin_user_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_invite" ADD CONSTRAINT "admin_invite_invited_by_admin_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."admin_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_invite_token_unique" ON "admin_invite" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_user_auth_user_unique" ON "admin_user" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_user_email_unique" ON "admin_user" USING btree ("email");
--> statement-breakpoint
-- ============================================================================
-- Hand-written tail, same two concerns as migration 0000: the cross-schema FK
-- drizzle-kit does not own, and RLS.
--
-- CASCADE (not customer's SET NULL) is deliberate: a customer's orders must
-- outlive their account, but an admin identity with no auth user behind it is
-- a dead row. admin_action holds the durable record and RESTRICTs its actor.
ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_auth_user_fk"
  FOREIGN KEY ("auth_user_id") REFERENCES auth.users(id) ON DELETE CASCADE;--> statement-breakpoint

-- Deny-all, as every other table (data-model.md §9.1). These three hold the
-- keys to the shop, so the anon PostgREST surface must never see them.
ALTER TABLE "admin_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_action" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_invite" ENABLE ROW LEVEL SECURITY;
