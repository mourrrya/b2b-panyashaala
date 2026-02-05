import { protect, ProtectedRequest } from "@/lib/auth/protect";
import { handleError } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import type { ErrorServerRes, GetListServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { getCustomerOrders, OrderWithDetails } from "../services/orderServices";

async function getOrdersHandler(
  request: ProtectedRequest,
): Promise<NextResponse<GetListServerRes<OrderWithDetails[]> | ErrorServerRes>> {
  try {
    const { user } = request.auth;
    const orders = await getCustomerOrders(user.id);
    return NextResponse.json({ data: orders, success: true });
  } catch (error) {
    logger.error({ error }, "Error fetching orders");
    return handleError(error);
  }
}

export const GET = protect(getOrdersHandler);
