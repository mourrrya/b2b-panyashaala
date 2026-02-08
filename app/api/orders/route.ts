import { protect, ProtectedRequest } from "@/lib/auth/protect";
import { handleError } from "@/lib/backend/errorHandler";
import type { ErrorServerRes, GetServerListRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { getCustomerOrders, OrderWithDetails } from "../services/orderServices";

async function getOrdersHandler(
  request: ProtectedRequest,
): Promise<NextResponse<GetServerListRes<OrderWithDetails[]> | ErrorServerRes>> {
  try {
    const { user } = request.auth;
    const orders = await getCustomerOrders(user.id);
    return NextResponse.json({ data: orders, success: true });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = protect(getOrdersHandler);
