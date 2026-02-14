import { ErrorNotFound } from "@/lib/backend/errorHandler";
import { prisma } from "@/lib/backend/prisma";
import { ERROR_MESSAGES } from "@/lib/constants";
import { serializeProductData } from "@/lib/productUtils";
import { CollectionProductsFiltersInput } from "@/lib/schema/schema";

// =============================================================================
// TYPES
// =============================================================================

export interface CollectionListItem {
  id: string;
  name: string;
  description: string | null;
  productCount: number;
}

export interface PaginatedCollectionProducts {
  collection: {
    id: string;
    name: string;
    description: string | null;
  };
  products: ReturnType<typeof serializeProductData>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// =============================================================================
// GET ALL COLLECTIONS (non-deleted, with product counts)
// =============================================================================

export async function getCollections(): Promise<CollectionListItem[]> {
  const collections = await prisma.productCollection.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          products: {
            where: {
              product: { isDeleted: false },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    productCount: c._count.products,
  }));
}

// =============================================================================
// GET COLLECTION PRODUCTS (paginated)
// =============================================================================

export async function getCollectionProducts(
  collectionName: string,
  filters: CollectionProductsFiltersInput,
): Promise<PaginatedCollectionProducts> {
  const collection = await prisma.productCollection.findFirst({
    where: {
      name: { equals: collectionName, mode: "insensitive" },
      isDeleted: false,
    },
    select: { id: true, name: true, description: true },
  });

  if (!collection) {
    throw new ErrorNotFound(ERROR_MESSAGES.RESOURCE.COLLECTION_NOT_FOUND);
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 12;
  const skip = (page - 1) * limit;

  const associationWhere = {
    collectionId: collection.id,
    product: { isDeleted: false },
  };

  const [associations, total] = await Promise.all([
    prisma.productCollectionAssociation.findMany({
      where: associationWhere,
      include: {
        product: {
          include: {
            variants: {
              where: { isDeleted: false },
              include: {
                images: true,
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.productCollectionAssociation.count({ where: associationWhere }),
  ]);

  const products = associations.map((a) => serializeProductData(a.product));

  return {
    collection: {
      id: collection.id,
      name: collection.name,
      description: collection.description,
    },
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
