/*/*

  Warnings:  Warnings:



  - Added the required column `measurement_unit` to the `order_items` table without a default value. This is not possible if the table is not empty.  - The values [G] on the enum `MeasurementUnit` will be removed. If these variants are still used in the database, this will fail.

  - Added the required column `net_content` to the `order_items` table without a default value. This is not possible if the table is not empty.  - Added the required column `measurement_unit` to the `order_items` table without a default value. This is not possible if the table is not empty.

  - Added the required column `product_category` to the `order_items` table without a default value. This is not possible if the table is not empty.  - Added the required column `net_content` to the `order_items` table without a default value. This is not possible if the table is not empty.

  - Added the required column `product_category` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/

*/

-- Step 1: Add columns with default values temporarily-- AlterEnum - Remove 'G' and keep only 'GM'

ALTER TABLE "order_items"BEGIN;

ADD COLUMN "measurement_unit" "MeasurementUnit" DEFAULT 'ML',CREATE TYPE "MeasurementUnit_new" AS ENUM ('ML', 'L', 'GM', 'KG', 'PCS');

ADD COLUMN "net_content" DECIMAL(10,2) DEFAULT 0,ALTER TABLE "variants" ALTER COLUMN "measurementUnit" TYPE "MeasurementUnit_new" USING ("measurementUnit"::text::"MeasurementUnit_new");

ADD COLUMN "product_category" "ProductCategory" DEFAULT 'ESSENTIAL_OIL';ALTER TYPE "MeasurementUnit" RENAME TO "MeasurementUnit_old";

ALTER TYPE "MeasurementUnit_new" RENAME TO "MeasurementUnit";

-- Step 2: Populate the new columns from related variant and product dataDROP TYPE "public"."MeasurementUnit_old";

UPDATE "order_items" oiCOMMIT;

SET

  "net_content" = v."netContent",-- Step 1: Add columns with default values temporarily

  "measurement_unit" = v."measurementUnit",ALTER TABLE "order_items" 

  "product_category" = p."category"ADD COLUMN "measurement_unit" "MeasurementUnit" DEFAULT 'ML',

FROM "variants" vADD COLUMN "net_content" DECIMAL(10,2) DEFAULT 0,

JOIN "products" p ON v."productId" = p.idADD COLUMN "product_category" "ProductCategory" DEFAULT 'ESSENTIAL_OIL';

WHERE oi."variant_id" = v.id;

-- Step 2: Populate the new columns from related variant and product data

-- Step 3: Make columns NOT NULL (remove defaults to make them truly required)UPDATE "order_items" oi

ALTER TABLE "order_items"SET 

ALTER COLUMN "measurement_unit" SET NOT NULL,  "net_content" = v."netContent",

ALTER COLUMN "measurement_unit" DROP DEFAULT,  "measurement_unit" = v."measurementUnit",

ALTER COLUMN "net_content" SET NOT NULL,  "product_category" = p."category"

ALTER COLUMN "net_content" DROP DEFAULT,FROM "variants" v

ALTER COLUMN "product_category" SET NOT NULL,JOIN "products" p ON v."productId" = p.id

ALTER COLUMN "product_category" DROP DEFAULT;WHERE oi."variant_id" = v.id;


-- Step 3: Remove default constraints (make them truly required)
ALTER TABLE "order_items" 
ALTER COLUMN "measurement_unit" DROP DEFAULT,
ALTER COLUMN "net_content" DROP DEFAULT,
ALTER COLUMN "product_category" DROP DEFAULT;
