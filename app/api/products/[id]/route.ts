import { ErrorInvalidRequest, handleError } from "@/lib/backend/errorHandler";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ErrorServerRes, GetServerRes } from "@/types/api.payload.types";
import { ProductWithVariantsImages } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "../../services/productServices";

interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

export async function GET(
  _: NextRequest,
  context: RouteContext<{ id: string }>,
): Promise<NextResponse<GetServerRes<ProductWithVariantsImages> | ErrorServerRes>> {
  const { id } = await context.params;
  if (!id) throw new ErrorInvalidRequest(ERROR_MESSAGES.RESOURCE.INVALID_PRODUCT_ID);

  try {
    const product = await getProductById(id);
    return NextResponse.json({ data: product, success: true });
  } catch (error) {
    return handleError(error);
  }
}
