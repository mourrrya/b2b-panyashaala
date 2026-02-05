import { protect, ProtectedRequest } from "@/lib/auth/protect";
import { ErrorNotFound, handleError } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ErrorServerRes, GetServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { getOrderById, OrderWithDetails } from "../../services/orderServices";

async function getOrderHandler(
  request: ProtectedRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetServerRes<OrderWithDetails> | ErrorServerRes>> {
  try {
    const { user } = request.auth;
    const { id } = await params;

    const order = await getOrderById(user.id, id);

    if (!order) {
      throw new ErrorNotFound(ERROR_MESSAGES.RESOURCE.ORDER_NOT_FOUND);
    }

    return NextResponse.json({ data: order, success: true });
  } catch (error) {
    logger.error({ error }, "Error fetching order");
    return handleError(error);
  }
}

export const GET = protect(getOrderHandler);
