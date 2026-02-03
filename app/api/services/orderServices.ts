import { ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { prisma } from "@/lib/backend/prisma";
import { OrderItem } from "@/prisma/generated/prisma/client";
import { OrderWithDetails } from "@/types/order";

export type { OrderWithDetails };

// Helper to transform order items
function transformOrderItem(
  item: OrderItem & { variant?: { id: string; variantName: string } },
) {
  return {
    id: item.id,
    productName: item.productName,
    variantName: item.variantName,
    quantity: item.quantity,
    netContent: Number(item.netContent),
    measurementUnit: item.measurementUnit,
    unitPrice: Number(item.unitPrice),
    taxAmount: Number(item.taxAmount),
    batchNumber: item.batchNumber,
    mfgDate: item.mfgDate,
    expiryDate: item.expiryDate,
    hsnCode: item.hsnCode,
    gstSlab: item.gstSlab,
    productCategory: item.productCategory,
  };
}

export async function getCustomerOrders(
  customerId: string,
): Promise<OrderWithDetails[]> {
  logger.info({ customerId }, "Fetching customer orders");
  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        orderItems: {
          include: {
            variant: {
              select: {
                id: true,
                variantName: true,
              },
            },
          },
        },
        shippingAddress: {
          select: {
            street: true,
            area: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
        billingAddress: {
          select: {
            street: true,
            area: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform Decimal fields to numbers
    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      totalTax: Number(order.totalTax),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(transformOrderItem),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
    }));
  } catch (error: any) {
    logger.error({ error, customerId }, "Error fetching customer orders");
    throw new ErrorUnknown();
  }
}

export async function getOrderById(
  customerId: string,
  orderId: string,
): Promise<OrderWithDetails | null> {
  logger.info({ customerId, orderId }, "Fetching order by ID");
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId, // Ensure the order belongs to the customer
      },
      include: {
        orderItems: {
          include: {
            variant: {
              select: {
                id: true,
                variantName: true,
              },
            },
          },
        },
        shippingAddress: {
          select: {
            street: true,
            area: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
        billingAddress: {
          select: {
            street: true,
            area: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
          },
        },
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      totalTax: Number(order.totalTax),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(transformOrderItem),
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
    };
  } catch (error: any) {
    logger.error({ error, customerId, orderId }, "Error fetching order by ID");
    throw new ErrorUnknown();
  }
}

export async function getCustomerOrderCount(
  customerId: string,
): Promise<number> {
  logger.info({ customerId }, "Getting customer order count");
  try {
    return await prisma.order.count({
      where: { customerId },
    });
  } catch (error: any) {
    logger.error({ error, customerId }, "Error getting order count");
    throw new ErrorUnknown();
  }
}
