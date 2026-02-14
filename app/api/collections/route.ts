import { handleError } from "@/lib/backend/errorHandler";
import type { ErrorServerRes, GetServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { CollectionListItem, getCollections } from "../services/collectionServices";

async function getCollectionsController(): Promise<
  NextResponse<GetServerRes<CollectionListItem[]> | ErrorServerRes>
> {
  try {
    const collections = await getCollections();
    return NextResponse.json({
      data: collections,
      success: true,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  return getCollectionsController();
}
