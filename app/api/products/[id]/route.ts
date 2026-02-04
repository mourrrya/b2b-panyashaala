import { ErrorInvalidRequest, handleError } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import type {
  ErrorResponse,
  ProductWithVariantsImagesReviews,
  SuccessRes,
} from "@/types/api.payload.types";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "../../services/productServices";

interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

export async function GET(
  _: NextRequest,
  context: RouteContext<{ id: string }>,
): Promise<
  NextResponse<SuccessRes<ProductWithVariantsImagesReviews> | ErrorResponse>
> {
  const { id } = await context.params;
  if (!id) throw new ErrorInvalidRequest("Invalid Product ID");

  try {
    const product = await getProductById(id);
    return NextResponse.json({ data: product, success: true });
  } catch (error) {
    logger.error({ error, productId: id }, "Error fetching product");
    return handleError(error);
  }
}
