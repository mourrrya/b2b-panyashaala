-- =====================================================
-- PRODUCTION DATABASE UPGRADE SCRIPT (INCREMENTAL)
-- This script only applies changes that are MISSING
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: CREATE MISSING ENUMS
-- =====================================================

DO $$ BEGIN CREATE TYPE "BatchStatus" AS ENUM ('QUARANTINE', 'RELEASED', 'EXPIRED', 'REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "GstSlab" AS ENUM ('ZERO_PERCENT', 'FIVE_PERCENT', 'TWELVE_PERCENT', 'EIGHTEEN_PERCENT', 'TWENTY_EIGHT_PERCENT', 'FORTY_PERCENT'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "GstType" AS ENUM ('INTRASTATE_GST', 'INTERSTATE_GST'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "MeasurementUnit" AS ENUM ('ML', 'L', 'G', 'KG', 'PCS'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'WASTE'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "CustomerType" AS ENUM ('INDIVIDUAL', 'BUSINESS'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'PARTIALLY_RECEIVED', 'COMPLETED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;
DO $$ BEGIN CREATE TYPE "ProductPurityType" AS ENUM ('PURE', 'REFINED', 'RCO'); EXCEPTION WHEN duplicate_object THEN NULL; END$$;

-- =====================================================
-- STEP 2: UPDATE PRODUCTS TABLE (add missing columns)
-- =====================================================

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "gstSlab" "GstSlab";
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "HSNCode" TEXT;

-- Set default values for existing products
UPDATE "products" SET 
    "gstSlab" = 'EIGHTEEN_PERCENT'::"GstSlab"
WHERE "gstSlab" IS NULL;

UPDATE "products" SET 
    "HSNCode" = '33012990'
WHERE "HSNCode" IS NULL;

-- Make columns NOT NULL
ALTER TABLE "products" ALTER COLUMN "gstSlab" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "HSNCode" SET NOT NULL;

-- =====================================================
-- STEP 3: UPDATE VARIANTS TABLE
-- =====================================================

-- Add new columns
ALTER TABLE "variants" ADD COLUMN IF NOT EXISTS "netContent" DECIMAL(10,2);
ALTER TABLE "variants" ADD COLUMN IF NOT EXISTS "measurementUnit" "MeasurementUnit";
ALTER TABLE "variants" ADD COLUMN IF NOT EXISTS "quantityAvailable" INTEGER DEFAULT 0;

-- Migrate data from 'size' to netContent + measurementUnit
UPDATE "variants" SET
    "netContent" = COALESCE(
        NULLIF(regexp_replace(COALESCE("size", '100ml'), '[^0-9.]', '', 'g'), '')::DECIMAL(10,2),
        100.00
    )
WHERE "netContent" IS NULL;

UPDATE "variants" SET
    "measurementUnit" = CASE
        WHEN LOWER(COALESCE("size", 'ml')) LIKE '%kg%' THEN 'KG'::"MeasurementUnit"
        WHEN LOWER(COALESCE("size", 'ml')) LIKE '%g%' AND LOWER(COALESCE("size", 'ml')) NOT LIKE '%kg%' THEN 'G'::"MeasurementUnit"
        WHEN LOWER(COALESCE("size", 'ml')) LIKE '%l%' AND LOWER(COALESCE("size", 'ml')) NOT LIKE '%ml%' THEN 'L'::"MeasurementUnit"
        ELSE 'ML'::"MeasurementUnit"
    END
WHERE "measurementUnit" IS NULL;

UPDATE "variants" SET 
    "quantityAvailable" = COALESCE("initialStock", 0)
WHERE "quantityAvailable" IS NULL OR "quantityAvailable" = 0;

-- Make columns NOT NULL
ALTER TABLE "variants" ALTER COLUMN "netContent" SET NOT NULL;
ALTER TABLE "variants" ALTER COLUMN "measurementUnit" SET NOT NULL;
ALTER TABLE "variants" ALTER COLUMN "quantityAvailable" SET NOT NULL;
ALTER TABLE "variants" ALTER COLUMN "quantityAvailable" SET DEFAULT 0;

-- Drop old columns (keep for now, uncomment later)
-- ALTER TABLE "variants" DROP COLUMN IF EXISTS "size";
-- ALTER TABLE "variants" DROP COLUMN IF EXISTS "initialStock";

-- =====================================================
-- STEP 4: CREATE CUSTOMERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "customers" (
    "id" TEXT NOT NULL,
    "type" "CustomerType" NOT NULL DEFAULT 'INDIVIDUAL',
    "gst_in" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "full_name" TEXT,
    "company_name" TEXT,
    "tax_id" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- Migrate data from profiles to customers (if not already done)
INSERT INTO "customers" ("id", "email", "phone", "full_name", "avatar_url", "created_at", "updated_at")
SELECT "id", "email", "phone", "full_name", "avatar_url", "created_at", "updated_at"
FROM "profiles"
WHERE NOT EXISTS (SELECT 1 FROM "customers" WHERE "customers"."id" = "profiles"."id")
ON CONFLICT ("id") DO NOTHING;

-- Add unique constraints (idempotent)
DO $$ BEGIN
    ALTER TABLE "customers" ADD CONSTRAINT "customers_gst_in_key" UNIQUE ("gst_in");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "customers" ADD CONSTRAINT "customers_email_key" UNIQUE ("email");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 5: CREATE ADDRESSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "addresses" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "vendor_id" TEXT,
    "type" "AddressType" NOT NULL,
    "street" TEXT NOT NULL,
    "area" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "addresses_customer_id_idx" ON "addresses"("customer_id");
CREATE INDEX IF NOT EXISTS "addresses_vendor_id_idx" ON "addresses"("vendor_id");

-- =====================================================
-- STEP 6: CREATE VENDORS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "payment_terms" TEXT,
    "lead_time_days" INTEGER,
    "minimum_order_value" DECIMAL(10,2),
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "vendors" ADD CONSTRAINT "vendors_name_key" UNIQUE ("name");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- Add FK from addresses
DO $$ BEGIN
    ALTER TABLE "addresses" ADD CONSTRAINT "addresses_vendor_id_fkey" 
        FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_fkey" 
        FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 7: CREATE PURCHASE_ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "purchase_orders" (
    "id" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_date" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_po_number_key" UNIQUE ("po_number");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

CREATE INDEX IF NOT EXISTS "purchase_orders_po_number_idx" ON "purchase_orders"("po_number");
CREATE INDEX IF NOT EXISTS "purchase_orders_vendor_id_idx" ON "purchase_orders"("vendor_id");

DO $$ BEGIN
    ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_fkey" 
        FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 8: CREATE PURCHASE_ORDER_ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "purchase_order_items" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "ordered_qty" INTEGER NOT NULL,
    "received_qty" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items"("purchase_order_id");
CREATE INDEX IF NOT EXISTS "purchase_order_items_variant_id_idx" ON "purchase_order_items"("variant_id");

DO $$ BEGIN
    ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" 
        FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_variant_id_fkey" 
        FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 9: CREATE BATCHES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "batches" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "purchase_order_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL(10,2) NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "analysisDate" TIMESTAMP(3),
    "labResults" JSONB,
    "status" "BatchStatus" NOT NULL DEFAULT 'QUARANTINE',
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "batches" ADD CONSTRAINT "batches_batchNumber_key" UNIQUE ("batchNumber");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

CREATE INDEX IF NOT EXISTS "batches_batchNumber_idx" ON "batches"("batchNumber");
CREATE INDEX IF NOT EXISTS "batches_variantId_idx" ON "batches"("variantId");
CREATE INDEX IF NOT EXISTS "batches_purchase_order_id_idx" ON "batches"("purchase_order_id");

DO $$ BEGIN
    ALTER TABLE "batches" ADD CONSTRAINT "batches_variantId_fkey" 
        FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "batches" ADD CONSTRAINT "batches_purchase_order_id_fkey" 
        FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 10: CREATE INVENTORY_TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS "inventory_transactions" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "batch_id" TEXT,
    "order_id" TEXT,
    "type" "TransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reference_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "inventory_transactions_variant_id_idx" ON "inventory_transactions"("variant_id");
CREATE INDEX IF NOT EXISTS "inventory_transactions_batch_id_idx" ON "inventory_transactions"("batch_id");
CREATE INDEX IF NOT EXISTS "inventory_transactions_order_id_idx" ON "inventory_transactions"("order_id");
CREATE INDEX IF NOT EXISTS "inventory_transactions_type_idx" ON "inventory_transactions"("type");

DO $$ BEGIN
    ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_variant_id_fkey" 
        FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_batch_id_fkey" 
        FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 11: UPDATE ORDERS TABLE
-- =====================================================

-- Add new columns
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_number" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subtotal" DECIMAL(10,2);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "total_tax" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_cost" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discount" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address_id" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "billing_address_id" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "gst_type" "GstType";
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- Rename user_id to customer_id if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') THEN
        ALTER TABLE "orders" RENAME COLUMN "user_id" TO "customer_id";
    END IF;
END$$;

-- Generate order numbers for existing orders (using subquery instead of window function)
UPDATE "orders" o SET 
    "order_number" = 'ORD-' || LPAD(sub.rn::TEXT, 6, '0')
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY "created_at") as rn
    FROM "orders"
    WHERE "order_number" IS NULL
) sub
WHERE o.id = sub.id AND o."order_number" IS NULL;

UPDATE "orders" SET "subtotal" = "total_amount" WHERE "subtotal" IS NULL;

-- Make columns NOT NULL (only if they have values)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "orders" WHERE "order_number" IS NULL) THEN
        ALTER TABLE "orders" ALTER COLUMN "order_number" SET NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM "orders" WHERE "subtotal" IS NULL) THEN
        ALTER TABLE "orders" ALTER COLUMN "subtotal" SET NOT NULL;
    END IF;
END$$;

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

CREATE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders"("order_number");

-- Update FK to customers
ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_user_id_fkey";
DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" 
        FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- Add FK to addresses
DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_fkey" 
        FOREIGN KEY ("shipping_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_fkey" 
        FOREIGN KEY ("billing_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- Add FK from inventory_transactions to orders
DO $$ BEGIN
    ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_order_id_fkey" 
        FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- STEP 12: UPDATE ORDER_ITEMS TABLE
-- =====================================================

-- Add new columns
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "product_name" TEXT;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "variant_name" TEXT;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "gst_slab" "GstSlab";
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "hsn_code" TEXT;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "tax_amount" DECIMAL(10,2) DEFAULT 0;

-- Rename price to unit_price if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'price') THEN
        ALTER TABLE "order_items" RENAME COLUMN "price" TO "unit_price";
    END IF;
END$$;

-- Populate new columns from variant/product data
UPDATE "order_items" oi SET
    "product_name" = p."name",
    "variant_name" = v."variantName",
    "gst_slab" = COALESCE(p."gstSlab", 'EIGHTEEN_PERCENT'::"GstSlab"),
    "hsn_code" = COALESCE(p."HSNCode", '33012990')
FROM "variants" v
JOIN "products" p ON v."productId" = p."id"
WHERE oi."variant_id" = v."id" AND (oi."product_name" IS NULL OR oi."variant_name" IS NULL);

-- Set defaults for any remaining NULL values
UPDATE "order_items" SET 
    "product_name" = 'Unknown Product',
    "variant_name" = 'Unknown Variant',
    "gst_slab" = 'EIGHTEEN_PERCENT'::"GstSlab",
    "hsn_code" = '33012990'
WHERE "product_name" IS NULL OR "variant_name" IS NULL OR "gst_slab" IS NULL OR "hsn_code" IS NULL;

-- Make columns NOT NULL
ALTER TABLE "order_items" ALTER COLUMN "product_name" SET NOT NULL;
ALTER TABLE "order_items" ALTER COLUMN "variant_name" SET NOT NULL;
ALTER TABLE "order_items" ALTER COLUMN "gst_slab" SET NOT NULL;
ALTER TABLE "order_items" ALTER COLUMN "hsn_code" SET NOT NULL;

-- =====================================================
-- STEP 13: UPDATE REVIEWS TABLE
-- =====================================================

-- Rename userId to customer_id if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'userId') THEN
        ALTER TABLE "reviews" RENAME COLUMN "userId" TO "customer_id";
    END IF;
END$$;

-- Update FK to customers
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_userId_fkey";
DO $$ BEGIN
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" 
        FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- =====================================================
-- DONE!
-- =====================================================

COMMIT;

-- =====================================================
-- AFTER RUNNING THIS SCRIPT:
-- 
-- 1. Verify the migration was successful
-- 2. Run: npx prisma migrate resolve --applied 20260117123637_baseline_after_reset
-- 3. Run: npx prisma migrate resolve --applied 20260117125148_remove_optional_gst_slab
-- 4. Run: npx prisma migrate resolve --applied 20260120073547_add_purity_type_to_product
-- 5. Run: npx prisma migrate resolve --applied 20260120104854_change_product_uniqueness_constraint
-- 6. Run: npx prisma migrate resolve --applied 20260120112916_change_concentration_to_decimal
-- 7. Run: npx prisma generate
-- =====================================================
