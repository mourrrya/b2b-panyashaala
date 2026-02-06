import { ErrorNotFound, ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
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
          variants: {
            where: { isDeleted: false },
            include: {
              images: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
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
    logger.error({ error }, "Error getting products");
    throw new ErrorUnknown("Error getting products");
  }
}

export async function getProductById(id: string): Promise<any> {
  logger.info({ productId: id }, "Getting product by ID");
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
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
      logger.warn({ productId: id }, "Product not found");
      throw new ErrorNotFound("Product");
    }
    logger.info({ productId: id }, "Product found successfully");
    return serializeProductData(product);
  } catch (error) {
    logger.error({ error, productId: id }, "Error getting product by ID");
    throw new ErrorUnknown("Error getting product by ID");
  }
}
