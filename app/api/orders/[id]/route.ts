import { protect, ProtectedRequest } from "@/lib/auth/protect";
import {
  ErrorNotFound,
  ErrorResponse,
  handleError,
} from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import type { SuccessRes } from "@/lib/types/api.payload.types";
import { NextResponse } from "next/server";
import { getOrderById, OrderWithDetails } from "../../services/orderServices";

async function getOrderHandler(
  request: ProtectedRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SuccessRes<OrderWithDetails> | ErrorResponse>> {
  try {
    const { user } = request.auth;
    const { id } = await params;

    const order = await getOrderById(user.id, id);

    if (!order) {
      throw new ErrorNotFound("Order not found");
    }

    return NextResponse.json({ data: order, success: true });
  } catch (error) {
    logger.error({ error }, "Error fetching order");
    return handleError(error);
  }
}

export const GET = protect(getOrderHandler);
