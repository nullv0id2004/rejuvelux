CREATE SEQUENCE "public"."order_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"recipient_name" text NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "address_pincode_check" CHECK ("address"."pincode" ~ '^[0-9]{6}$')
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_status_check" CHECK ("cart"."status" IN ('open','completed','abandoned'))
);
--> statement-breakpoint
CREATE TABLE "cart_line" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_paise" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_line_qty_check" CHECK ("cart_line"."quantity" > 0 AND "cart_line"."quantity" <= 10),
	CONSTRAINT "cart_line_price_check" CHECK ("cart_line"."unit_price_paise" >= 0)
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_level" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"stocked_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_level_stocked_check" CHECK ("inventory_level"."stocked_quantity" >= 0),
	CONSTRAINT "inventory_level_reserved_check" CHECK ("inventory_level"."reserved_quantity" >= 0),
	CONSTRAINT "inventory_level_no_oversell_check" CHECK ("inventory_level"."reserved_quantity" <= "inventory_level"."stocked_quantity")
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"cart_id" uuid NOT NULL,
	"customer_id" uuid,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"ship_name" text NOT NULL,
	"ship_line1" text NOT NULL,
	"ship_line2" text,
	"ship_city" text NOT NULL,
	"ship_state" text NOT NULL,
	"ship_pincode" text NOT NULL,
	"is_gift" boolean DEFAULT false NOT NULL,
	"gift_message" text,
	"subtotal_paise" bigint NOT NULL,
	"shipping_paise" bigint NOT NULL,
	"total_paise" bigint NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_currency_check" CHECK ("order"."currency" = 'INR'),
	CONSTRAINT "order_subtotal_check" CHECK ("order"."subtotal_paise" >= 0),
	CONSTRAINT "order_shipping_check" CHECK ("order"."shipping_paise" >= 0),
	CONSTRAINT "order_total_check" CHECK ("order"."total_paise" = "order"."subtotal_paise" + "order"."shipping_paise")
);
--> statement-breakpoint
CREATE TABLE "order_event" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" uuid NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_event_type_check" CHECK ("order_event"."type" IN ('placed','payment_captured','payment_failed','cancelled','shipped','delivered','refunded'))
);
--> statement-breakpoint
CREATE TABLE "order_line" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"product_name" text NOT NULL,
	"variant_name" text,
	"quantity" integer NOT NULL,
	"unit_price_paise" bigint NOT NULL,
	"line_total_paise" bigint NOT NULL,
	CONSTRAINT "order_line_qty_check" CHECK ("order_line"."quantity" > 0),
	CONSTRAINT "order_line_price_check" CHECK ("order_line"."unit_price_paise" >= 0),
	CONSTRAINT "order_line_total_check" CHECK ("order_line"."line_total_paise" = "order_line"."quantity" * "order_line"."unit_price_paise")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider" text DEFAULT 'razorpay' NOT NULL,
	"provider_order_id" text NOT NULL,
	"amount_paise" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_provider_check" CHECK ("payment"."provider" = 'razorpay'),
	CONSTRAINT "payment_amount_check" CHECK ("payment"."amount_paise" >= 0)
);
--> statement-breakpoint
CREATE TABLE "payment_event" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"payment_id" uuid NOT NULL,
	"provider_event_id" text NOT NULL,
	"type" text NOT NULL,
	"provider_payment_id" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"territory" text,
	"tea_type" text NOT NULL,
	"origin" text NOT NULL,
	"short_description" text NOT NULL,
	"ingredients" text NOT NULL,
	"brewing_leaf" text,
	"brewing_water" text,
	"brewing_time" text,
	"is_hero" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"standin_src" text,
	"standin_alt" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_territory_check" CHECK ("product"."territory" IS NULL OR "product"."territory" IN ('FOCUS','ELEGANCE','LEGACY')),
	CONSTRAINT "product_status_check" CHECK ("product"."status" IN ('draft','active','retired'))
);
--> statement-breakpoint
CREATE TABLE "product_variant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"name" text,
	"price_paise" bigint,
	"net_quantity" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variant_price_check" CHECK ("product_variant"."price_paise" IS NULL OR "product_variant"."price_paise" >= 0),
	CONSTRAINT "product_variant_status_check" CHECK ("product_variant"."status" IN ('draft','active','retired'))
);
--> statement-breakpoint
CREATE TABLE "reservation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"state" text DEFAULT 'held' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reservation_qty_check" CHECK ("reservation"."quantity" > 0),
	CONSTRAINT "reservation_state_check" CHECK ("reservation"."state" IN ('held','consumed','released'))
);
--> statement-breakpoint
CREATE TABLE "variant_inventory_item" (
	"variant_id" uuid NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"required_quantity" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "variant_inventory_item_variant_id_inventory_item_id_pk" PRIMARY KEY("variant_id","inventory_item_id"),
	CONSTRAINT "variant_inventory_item_qty_check" CHECK ("variant_inventory_item"."required_quantity" > 0)
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_line" ADD CONSTRAINT "cart_line_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_level" ADD CONSTRAINT "inventory_level_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_event" ADD CONSTRAINT "order_event_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_line" ADD CONSTRAINT "order_line_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_event" ADD CONSTRAINT "payment_event_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_inventory_item" ADD CONSTRAINT "variant_inventory_item_variant_id_product_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_inventory_item" ADD CONSTRAINT "variant_inventory_item_inventory_item_id_inventory_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_item"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cart_line_cart_variant_unique" ON "cart_line" USING btree ("cart_id","variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_auth_user_unique" ON "customer" USING btree ("auth_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_item_sku_unique" ON "inventory_item" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_level_item_unique" ON "inventory_level" USING btree ("inventory_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_number_unique" ON "order" USING btree ("order_number");--> statement-breakpoint
CREATE UNIQUE INDEX "order_cart_unique" ON "order" USING btree ("cart_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_order_unique" ON "payment" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_provider_order_unique" ON "payment" USING btree ("provider_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_event_provider_unique" ON "payment_event" USING btree ("provider_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_slug_unique" ON "product" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variant_sku_unique" ON "product_variant" USING btree ("sku");
--> statement-breakpoint
-- ============================================================================
-- Hand-written tail. Two things drizzle-kit deliberately does not own
-- (lib/server/db/schema.ts header, data-model.md §5.1 and §9.1):
--
-- 1. customer.auth_user_id → auth.users(id). Cross-schema FK into Supabase
--    Auth. ON DELETE SET NULL: erasing an auth account never destroys the
--    commerce record — the customer row survives as a guest-shaped row.
ALTER TABLE "customer" ADD CONSTRAINT "customer_auth_user_fk"
  FOREIGN KEY ("auth_user_id") REFERENCES auth.users(id) ON DELETE SET NULL;--> statement-breakpoint

-- 2. RLS: enabled on every table, ZERO policies — deny-all by design.
--    The domain layer (apps/web/lib/server) connects as postgres via the
--    pooler and bypasses RLS; the anon-key PostgREST surface sees nothing.
--    get_advisors reporting "RLS enabled, no policies" is the design.
ALTER TABLE "product" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_variant" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventory_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "inventory_level" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "variant_inventory_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reservation" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "customer" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "address" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cart" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cart_line" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_line" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_event" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_event" ENABLE ROW LEVEL SECURITY;
