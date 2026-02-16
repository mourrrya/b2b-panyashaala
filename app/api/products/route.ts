import { handleError } from "@/lib/backend/errorHandler";
import { withSentryAPI } from "@/lib/backend/sentryHelpers";
import { validateQueryParams } from "@/lib/backend/validation";
import { ProductFiltersQuerySchema } from "@/lib/schema/schema";
import type { ErrorServerRes, GetServerListRes } from "@/types/api.payload.types";
import { ProductWithVariantsImages } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../services/productServices";

async function getProductsController(
  request: NextRequest,
): Promise<NextResponse<GetServerListRes<ProductWithVariantsImages[]> | ErrorServerRes>> {
  try {
    const { searchParams } = new URL(request.url);
    const validation = validateQueryParams(searchParams, ProductFiltersQuerySchema);
    const filters = validation.data;
    const result = await getProducts(filters);
    return NextResponse.json({
      data: result.products,
      success: true,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withSentryAPI(getProductsController, {
  operationName: "GET /api/products",
});
