import { handleError } from "@/lib/backend/errorHandler";
import { validateQueryParams } from "@/lib/backend/validation";
import { CollectionProductsFiltersSchema } from "@/lib/schema/schema";
import type { ErrorServerRes, GetServerListRes } from "@/types/api.payload.types";
import { ProductWithVariantsImages } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";
import { getCollectionProducts } from "../../../services/collectionServices";

interface RouteParams {
  params: Promise<{ name: string }>;
}

async function getCollectionProductsController(
  request: NextRequest,
  { params }: RouteParams,
): Promise<
  NextResponse<
    | (GetServerListRes<ProductWithVariantsImages[]> & {
        collection: { id: string; name: string; description: string | null };
      })
    | ErrorServerRes
  >
> {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const { searchParams } = new URL(request.url);
    const validation = validateQueryParams(searchParams, CollectionProductsFiltersSchema);
    const filters = validation.data;

    const result = await getCollectionProducts(decodedName, filters);

    return NextResponse.json({
      data: result.products,
      collection: result.collection,
      success: true,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest, routeParams: RouteParams) {
  return getCollectionProductsController(request, routeParams);
}
