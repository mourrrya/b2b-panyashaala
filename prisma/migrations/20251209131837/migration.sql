-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductCategory" ADD VALUE 'ESSENTIAL_OIL';
ALTER TYPE "ProductCategory" ADD VALUE 'FIXED_OIL';
ALTER TYPE "ProductCategory" ADD VALUE 'EXTRACT';
ALTER TYPE "ProductCategory" ADD VALUE 'HYDROSOL';
