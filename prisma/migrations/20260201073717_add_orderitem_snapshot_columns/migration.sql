/*
  Warnings:

  - The values [G] on the enum `MeasurementUnit` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `measurement_unit` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net_content` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add columns with defaults
ALTER TABLE "order_items" 
ADD COLUMN "measurement_unit" "MeasurementUnit" DEFAULT 'ML',
ADD COLUMN "net_content" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN "product_category" "ProductCategory" DEFAULT 'ESSENTIAL_OIL';

-- Step 2: Populate from variant and product data
UPDATE "order_items"
SET
  "net_content" = "variants"."netContent",
  "measurement_unit" = "variants"."measurementUnit",
  "product_category" = "products"."category"
FROM "variants"
INNER JOIN "products" ON "variants"."productId" = "products"."id"
WHERE "order_items"."variant_id" = "variants"."id";

-- Step 3: Make columns NOT NULL and remove defaults
ALTER TABLE "order_items"
ALTER COLUMN "measurement_unit" SET NOT NULL,
ALTER COLUMN "measurement_unit" DROP DEFAULT,
ALTER COLUMN "net_content" SET NOT NULL,
ALTER COLUMN "net_content" DROP DEFAULT,
ALTER COLUMN "product_category" SET NOT NULL,
ALTER COLUMN "product_category" DROP DEFAULT;
