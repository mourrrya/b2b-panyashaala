-- AlterTable
ALTER TABLE "products" ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "product_collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_collection_associations" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_collection_associations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_collections_name_key" ON "product_collections"("name");

-- CreateIndex
CREATE INDEX "product_collections_name_idx" ON "product_collections"("name");

-- CreateIndex
CREATE INDEX "product_collections_is_deleted_idx" ON "product_collections"("is_deleted");

-- CreateIndex
CREATE INDEX "product_collection_associations_product_id_idx" ON "product_collection_associations"("product_id");

-- CreateIndex
CREATE INDEX "product_collection_associations_collection_id_idx" ON "product_collection_associations"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_collection_associations_product_id_collection_id_key" ON "product_collection_associations"("product_id", "collection_id");

-- AddForeignKey
ALTER TABLE "product_collection_associations" ADD CONSTRAINT "product_collection_associations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_collection_associations" ADD CONSTRAINT "product_collection_associations_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "product_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
