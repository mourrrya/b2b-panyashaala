import { ErrorInvalidRequest, handleError } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ErrorServerRes, SuccessRes } from "@/types/api.payload.types";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "../../services/productServices";

interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

export async function GET(
  _: NextRequest,
  context: RouteContext<{ id: string }>,
): Promise<
  NextResponse<SuccessRes<ProductWithVariantsImagesReviews> | ErrorServerRes>
> {
  const { id } = await context.params;
  if (!id)
    throw new ErrorInvalidRequest(ERROR_MESSAGES.RESOURCE.INVALID_PRODUCT_ID);

  try {
    const product = await getProductById(id);
    return NextResponse.json({ data: product, success: true });
  } catch (error) {
    logger.error({ error, productId: id }, "Error fetching product");
    return handleError(error);
  }
}
