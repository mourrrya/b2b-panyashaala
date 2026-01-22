/*
  Warnings:

  - A unique constraint covering the columns `[name,purityType]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "products_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "products_name_purityType_key" ON "products"("name", "purityType");
