/*
  Warnings:

  - The `concentration` column on the `variants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `purityType` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- First, handle the purityType issue by setting a default value for existing NULL values
UPDATE "products" SET "purityType" = 'RCO' WHERE "purityType" IS NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "purityType" SET NOT NULL;

-- Convert concentration strings to numbers and store temporarily
ALTER TABLE "variants" ADD COLUMN "concentration_temp" DECIMAL(5,2);

-- Extract numeric values from concentration strings
UPDATE "variants"
SET "concentration_temp" = CASE
  WHEN "concentration" = '100% Pure' THEN 100.00
  WHEN "concentration" LIKE '%%' THEN CAST(REPLACE("concentration", '%', '') AS DECIMAL(5,2))
  ELSE NULL
END;

-- Drop the old column and rename the temp column
ALTER TABLE "variants" DROP COLUMN "concentration",
ADD COLUMN     "concentration" DECIMAL(5,2);

-- Copy the converted values
UPDATE "variants" SET "concentration" = "concentration_temp";

-- Drop the temp column
ALTER TABLE "variants" DROP COLUMN "concentration_temp";
