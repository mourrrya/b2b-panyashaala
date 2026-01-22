-- CreateEnum
CREATE TYPE "ProductPurityType" AS ENUM ('PURE', 'REFINED', 'RCO');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "purityType" "ProductPurityType";
