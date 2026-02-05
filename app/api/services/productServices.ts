import { ErrorNotFound, ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { prisma } from "@/lib/backend/prisma";
import { serializeProductData } from "@/lib/productUtils";
import { ProductFiltersQuery } from "@/lib/schema/schema";
import { Prisma, ProductCategory } from "@prisma/client";

export async function getProducts(filters: ProductFiltersQuery) {
  const where: Prisma.ProductWhereInput = {};
  try {
    if (filters.category && Object.values(ProductCategory).includes(filters.category)) {
      where.category = filters.category;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    return (
      await prisma.product.findMany({
        where: {
          isDeleted: false,
          variants: {
            some: {
              isDeleted: false,
            },
          },
          ...where,
        },
        include: {
          variants: {
            include: {
              images: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    ).map(serializeProductData);
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
