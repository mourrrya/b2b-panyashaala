/*
  Migration: Consistent Column Naming (camelCase to snake_case)
  
  This migration renames columns from camelCase to snake_case for consistency.
  Using RENAME COLUMN to preserve data. Written to be idempotent so it can
  safely run on databases in any partial state.
*/

-- Helper: Idempotent column rename function
CREATE OR REPLACE FUNCTION _rename_column_if_exists(
  _table TEXT, _old TEXT, _new TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = _table AND column_name = _old
  ) THEN
    EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', _table, _old, _new);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Helper: Idempotent constraint drop (for unique constraints that can't be dropped via DROP INDEX)
CREATE OR REPLACE FUNCTION _drop_constraint_if_exists(
  _table TEXT, _name TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = _table AND constraint_name = _name
  ) THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', _table, _name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Helper: Idempotent foreign key drop
CREATE OR REPLACE FUNCTION _drop_fk_if_exists(
  _table TEXT, _name TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = _table AND constraint_name = _name
      AND constraint_type = 'FOREIGN KEY'
  ) THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', _table, _name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. Drop foreign key constraints (old names)
-- ============================================================
SELECT _drop_fk_if_exists('batches',  'batches_variantId_fkey');
SELECT _drop_fk_if_exists('images',   'images_variantId_fkey');
SELECT _drop_fk_if_exists('reviews',  'reviews_variantId_fkey');
SELECT _drop_fk_if_exists('variants', 'variants_productId_fkey');

-- ============================================================
-- 2. Drop old indexes and constraints
-- ============================================================
-- For unique constraints created by Prisma: drop as constraint first, then index as fallback
SELECT _drop_constraint_if_exists('batches',  'batches_batchNumber_key');
SELECT _drop_constraint_if_exists('products', 'products_name_purityType_key');
SELECT _drop_constraint_if_exists('variants', 'variants_variantName_key');

DROP INDEX IF EXISTS "batches_batchNumber_key";
DROP INDEX IF EXISTS "batches_batchNumber_idx";
DROP INDEX IF EXISTS "batches_variantId_idx";
DROP INDEX IF EXISTS "products_name_purityType_key";
DROP INDEX IF EXISTS "variants_variantName_key";

-- ============================================================
-- 3. Rename columns (idempotent — skips if already renamed)
-- ============================================================

-- products
SELECT _rename_column_if_exists('products', 'purityType',         'purity_type');
SELECT _rename_column_if_exists('products', 'botanicalName',      'botanical_name');
SELECT _rename_column_if_exists('products', 'extractionMethod',   'extraction_method');
SELECT _rename_column_if_exists('products', 'chemicalFormula',    'chemical_formula');
SELECT _rename_column_if_exists('products', 'casNumber',          'cas_number');
SELECT _rename_column_if_exists('products', 'hazardClass',        'hazard_class');
SELECT _rename_column_if_exists('products', 'storageConditions',  'storage_conditions');
SELECT _rename_column_if_exists('products', 'gstSlab',            'gst_slab');
SELECT _rename_column_if_exists('products', 'HSNCode',            'hsn_code');
SELECT _rename_column_if_exists('products', 'standardLabResults', 'standard_lab_results');
SELECT _rename_column_if_exists('products', 'isDeleted',          'is_deleted');
SELECT _rename_column_if_exists('products', 'createdAt',          'created_at');
SELECT _rename_column_if_exists('products', 'updatedAt',          'updated_at');

-- variants
SELECT _rename_column_if_exists('variants', 'productId',          'product_id');
SELECT _rename_column_if_exists('variants', 'variantName',        'variant_name');
SELECT _rename_column_if_exists('variants', 'netContent',         'net_content');
SELECT _rename_column_if_exists('variants', 'measurementUnit',    'measurement_unit');
SELECT _rename_column_if_exists('variants', 'retailPrice',        'retail_price');
SELECT _rename_column_if_exists('variants', 'wholesalePrice',     'wholesale_price');
SELECT _rename_column_if_exists('variants', 'costPrice',          'cost_price');
SELECT _rename_column_if_exists('variants', 'quantityAvailable',  'quantity_available');
SELECT _rename_column_if_exists('variants', 'minStockLevel',      'min_stock_level');
SELECT _rename_column_if_exists('variants', 'shelfLife',          'shelf_life');
SELECT _rename_column_if_exists('variants', 'isDeleted',          'is_deleted');
SELECT _rename_column_if_exists('variants', 'createdAt',          'created_at');
SELECT _rename_column_if_exists('variants', 'updatedAt',          'updated_at');

-- batches
SELECT _rename_column_if_exists('batches', 'batchNumber',      'batch_number');
SELECT _rename_column_if_exists('batches', 'variantId',         'variant_id');
SELECT _rename_column_if_exists('batches', 'costPrice',         'cost_price');
SELECT _rename_column_if_exists('batches', 'manufactureDate',   'manufacture_date');
SELECT _rename_column_if_exists('batches', 'expiryDate',        'expiry_date');
SELECT _rename_column_if_exists('batches', 'analysisDate',      'analysis_date');
SELECT _rename_column_if_exists('batches', 'labResults',        'lab_results');
SELECT _rename_column_if_exists('batches', 'isDeleted',         'is_deleted');
SELECT _rename_column_if_exists('batches', 'createdAt',         'created_at');
SELECT _rename_column_if_exists('batches', 'updatedAt',         'updated_at');

-- reviews
SELECT _rename_column_if_exists('reviews', 'variantId', 'variant_id');
SELECT _rename_column_if_exists('reviews', 'createdAt', 'created_at');

-- images
SELECT _rename_column_if_exists('images', 'variantId', 'variant_id');
SELECT _rename_column_if_exists('images', 'createdAt', 'created_at');
SELECT _rename_column_if_exists('images', 'isDeleted', 'is_deleted');
SELECT _rename_column_if_exists('images', 'updatedAt', 'updated_at');

-- order_items
SELECT _rename_column_if_exists('order_items', 'unitPrice', 'unit_price');

-- ============================================================
-- 4. Recreate indexes with new column names (idempotent)
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS "batches_batch_number_key" ON "batches"("batch_number");
CREATE INDEX IF NOT EXISTS "batches_batch_number_idx" ON "batches"("batch_number");
CREATE INDEX IF NOT EXISTS "batches_variant_id_idx" ON "batches"("variant_id");
CREATE UNIQUE INDEX IF NOT EXISTS "products_name_purity_type_key" ON "products"("name", "purity_type");
CREATE UNIQUE INDEX IF NOT EXISTS "variants_variant_name_key" ON "variants"("variant_name");

-- ============================================================
-- 5. Recreate foreign key constraints with new column names
-- ============================================================
-- Drop new-name FKs first if they exist (idempotent)
SELECT _drop_fk_if_exists('variants', 'variants_product_id_fkey');
SELECT _drop_fk_if_exists('batches',  'batches_variant_id_fkey');
SELECT _drop_fk_if_exists('reviews',  'reviews_variant_id_fkey');
SELECT _drop_fk_if_exists('images',   'images_variant_id_fkey');

ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "batches" ADD CONSTRAINT "batches_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "images" ADD CONSTRAINT "images_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 6. Cleanup helper functions
-- ============================================================
DROP FUNCTION IF EXISTS _rename_column_if_exists;
DROP FUNCTION IF EXISTS _drop_constraint_if_exists;
DROP FUNCTION IF EXISTS _drop_fk_if_exists;
