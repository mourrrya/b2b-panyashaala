import {
  ErrorInvalidRequest,
  ErrorResponse,
  handleError,
} from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { RouteContext } from "@/lib/backend/protect";
import type {
  ProductWithVariantsImagesReviews,
  SuccessRes,
} from "@/lib/types/api.payload.types";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "../../services/productServices";

export async function GET(
  _: NextRequest,
  context: RouteContext<{ id: string }>
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
