/*
  Warnings:

  - The values [G] on the enum `MeasurementUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MeasurementUnit_new" AS ENUM ('ML', 'L', 'GM', 'KG', 'PCS');
ALTER TABLE "variants" ALTER COLUMN "measurementUnit" TYPE "MeasurementUnit_new" USING ("measurementUnit"::text::"MeasurementUnit_new");
ALTER TABLE "order_items" ALTER COLUMN "measurement_unit" TYPE "MeasurementUnit_new" USING ("measurement_unit"::text::"MeasurementUnit_new");
ALTER TYPE "MeasurementUnit" RENAME TO "MeasurementUnit_old";
ALTER TYPE "MeasurementUnit_new" RENAME TO "MeasurementUnit";
DROP TYPE "public"."MeasurementUnit_old";
COMMIT;
