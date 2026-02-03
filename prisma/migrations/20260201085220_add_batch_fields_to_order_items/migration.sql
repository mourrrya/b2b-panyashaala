/*
  Warnings:

  - Added the required column `batch_number` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mfg_date` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add columns with defaults
ALTER TABLE "order_items"
ADD COLUMN "batch_number" TEXT DEFAULT 'UNKNOWN',
ADD COLUMN "mfg_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "expiry_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 year';

-- Step 2: Populate from batch data
UPDATE "order_items"
SET
  "batch_number" = "batches"."batchNumber",
  "mfg_date" = "batches"."manufactureDate",
  "expiry_date" = "batches"."expiryDate"
FROM "batches"
WHERE "order_items"."batch_id" = "batches"."id";

-- Step 3: Make columns NOT NULL and remove defaults
ALTER TABLE "order_items"
ALTER COLUMN "batch_number" SET NOT NULL,
ALTER COLUMN "batch_number" DROP DEFAULT,
ALTER COLUMN "mfg_date" SET NOT NULL,
ALTER COLUMN "mfg_date" DROP DEFAULT,
ALTER COLUMN "expiry_date" SET NOT NULL,
ALTER COLUMN "expiry_date" DROP DEFAULT;
