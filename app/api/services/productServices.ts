import { ErrorNotFound, ErrorUnknown } from "@/lib/backend/errorHandler";
import { prisma } from "@/lib/backend/prisma";
import { serializeProductData } from "@/lib/productUtils";
import { ProductFiltersInput } from "@/lib/schema/schema";
import { Prisma, ProductCategory } from "@prisma/client";

export interface PaginatedProducts {
  products: ReturnType<typeof serializeProductData>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getProducts(filters: ProductFiltersInput): Promise<PaginatedProducts> {
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
    variants: { some: { isDeleted: false } },
  };

  try {
    // Filter by specific IDs (for basket lookups)
    if (filters.ids) {
      const idsArray = Array.isArray(filters.ids)
        ? filters.ids
        : filters.ids.split(",").filter(Boolean);
      if (idsArray.length > 0) {
        where.id = { in: idsArray };
      }
    }

    // Filter by category
    if (filters.category && Object.values(ProductCategory).includes(filters.category)) {
      where.category = filters.category;
    }

    // Filter by usage (searches variant usage field)
    if (filters.usage) {
      where.variants = {
        some: {
          isDeleted: false,
          usage: { contains: filters.usage, mode: "insensitive" },
        },
      };
    }

    // Full-text search across name, botanicalName, variant usage
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        {
          botanicalName: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          variants: {
            some: {
              isDeleted: false,
              usage: { contains: filters.search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const page: number = Number(filters.page) || 1;
    const limit: number = Number(filters.limit) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          collections: {
            include: { collection: true },
            where: { collection: { isDeleted: false } },
          },
          variants: {
            where: { isDeleted: false },
            include: {
              images: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(serializeProductData),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    // Add context to error for better debugging
    throw new ErrorUnknown("Error getting products", undefined, {
      filters,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getProductById(id: string): Promise<any> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        collections: {
          include: { collection: true },
          where: { collection: { isDeleted: false } },
        },
        variants: {
          where: { isDeleted: false },
          include: {
            images: true,
            reviews: true,
          },
        },
      },
    });
    if (!product) {
      throw new ErrorNotFound("Product");
    }
    return serializeProductData(product);
  } catch (error) {
    // If it's already an ErrorNotFound, re-throw it
    if (error instanceof ErrorNotFound) {
      throw error;
    }
    // Otherwise, wrap in ErrorUnknown with context
    throw new ErrorUnknown("Error getting product by ID", undefined, {
      productId: id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
