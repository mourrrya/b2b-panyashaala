import { handleError } from "@/lib/backend/errorHandler";
import { prisma } from "@/lib/backend/prisma";
import { ProductCategory } from "@/prisma/generated/prisma/client";
import { GetServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get distinct categories from products
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const categorySet = new Set<ProductCategory>();
    products.forEach((p) => {
      if (p.category !== null) {
        categorySet.add(p.category);
      }
    });

    const uniqueCategories: ProductCategory[] = Array.from(categorySet).sort();

    return NextResponse.json<GetServerRes<ProductCategory[]>>({
      success: true,
      data: uniqueCategories,
    });
  } catch (error) {
    return handleError(error);
  }
}
