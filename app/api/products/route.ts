import { handleError } from "@/lib/backend/errorHandler";
import { validateQueryParams } from "@/lib/backend/validation";
import { ProductFiltersQuerySchema } from "@/lib/schema";
import type {
  ErrorResponse,
  ProductWithVariantsImagesReviews,
  SuccessRes,
} from "@/types/api.payload.types";
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../services/productServices";

async function getProductsController(
  request: NextRequest,
): Promise<
  NextResponse<SuccessRes<ProductWithVariantsImagesReviews[]> | ErrorResponse>
> {
  try {
    const { searchParams } = new URL(request.url);
    const validation = validateQueryParams(
      searchParams,
      ProductFiltersQuerySchema,
    );
    const filters = validation.data;
    const products = await getProducts(filters);
    return NextResponse.json({ data: products, success: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  return getProductsController(request);
}
