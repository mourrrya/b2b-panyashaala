"use client";

import { swrFetcher } from "@/lib/client/api/axios";
import { UI_LABELS } from "@/lib/constants";
import { PRIVATE_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { GetServerListRes } from "@/types/api.payload.types";
import { OrderWithDetails } from "@/types/order";
import { Calendar, ChevronRight, Download, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// Status configuration with colors
const orderStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: {
    label: UI_LABELS.ORDERS.STATUS.PENDING,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  CONFIRMED: {
    label: UI_LABELS.ORDERS.STATUS.CONFIRMED,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  PROCESSING: {
    label: UI_LABELS.ORDERS.STATUS.PROCESSING,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
  },
  SHIPPED: {
    label: UI_LABELS.ORDERS.STATUS.SHIPPED,
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  DELIVERED: {
    label: UI_LABELS.ORDERS.STATUS.DELIVERED,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  CANCELLED: {
    label: UI_LABELS.ORDERS.STATUS.CANCELLED,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
};

const paymentStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: {
    label: UI_LABELS.ORDERS.PAYMENT_STATUS.PENDING,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  PAID: {
    label: UI_LABELS.ORDERS.PAYMENT_STATUS.PAID,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  FAILED: {
    label: UI_LABELS.ORDERS.PAYMENT_STATUS.FAILED,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
  REFUNDED: {
    label: UI_LABELS.ORDERS.PAYMENT_STATUS.REFUNDED,
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200",
  },
};

function StatusBadge({ status, type }: { status: string; type: "order" | "payment" }) {
  const config = type === "order" ? orderStatusConfig[status] : paymentStatusConfig[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md border ${config.bgColor} ${config.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {config.label}
    </span>
  );
}

function OrderCard({ order }: { order: OrderWithDetails }) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadInvoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(
      `Invoice download for order ${order.orderNumber} - This feature will generate a PDF invoice`,
    );
  };

  return (
    <div
      onClick={() => router.push(`/order/${order.id}`)}
      className={`
        relative overflow-hidden rounded-lg cursor-pointer
        bg-linear-to-br from-white/95 via-slate-50/85 to-slate-100/75
        backdrop-blur-sm
        border border-slate-200/60
        shadow-[0_2px_12px_-3px_rgba(51,65,85,0.08)]
        transition-all duration-300 ease-out
        hover:shadow-[0_8px_24px_-6px_rgba(51,65,85,0.15)]
        hover:-translate-y-0.5
        before:absolute before:inset-0 
        before:bg-linear-to-tr before:from-slate-200/15 before:via-transparent before:to-white/25
        before:pointer-events-none
        group
      `}
    >
      {/* Top edge highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-white/70 to-transparent z-10" />

      {/* Order Content */}
      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-8">
          {/* Order Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="self-start p-2 rounded-md bg-linear-to-br from-slate-100 to-slate-200/80">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1 space-y-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-800">{order.orderNumber}</h3>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} type="order" />
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </span>
                <span>
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-end gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {UI_LABELS.ORDERS.TOTAL}
              </p>
              <p className="text-lg font-bold text-slate-800">₹{order.totalAmount.toFixed(2)}</p>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title={UI_LABELS.ORDERS.DOWNLOAD_INVOICE}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{UI_LABELS.ORDERS.INVOICE}</span>
            </button>

            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyOrdersState() {
  return (
    <div
      className={`
      relative overflow-hidden rounded-lg p-12
      bg-linear-to-br from-white/95 via-slate-50/85 to-slate-100/75
      backdrop-blur-sm
      border border-slate-200/60
      shadow-[0_4px_24px_-4px_rgba(51,65,85,0.12)]
      text-center
    `}
    >
      <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-5 bg-linear-to-br from-slate-100 to-slate-200/80 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {UI_LABELS.ORDERS.NO_ORDERS_TITLE}
        </h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          {UI_LABELS.ORDERS.NO_ORDERS_SUBTITLE}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-md shadow-md shadow-emerald-500/25 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ShoppingBag className="w-4 h-4" />
          {UI_LABELS.ORDERS.BROWSE_PRODUCTS}
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg p-5 bg-linear-to-br from-white/95 via-slate-50/85 to-slate-100/75 border border-slate-200/60 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-slate-200 rounded" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  // Fetch orders using SWR
  const { data, isLoading, error } = useSWR<GetServerListRes<OrderWithDetails[]>>(
    PRIVATE_ROUTES.ORDERS.LIST,
    swrFetcher,
    SWR_CONFIG,
  );

  const orders = data?.data ?? [];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="relative bg-white border-b border-slate-200/60 shadow-sm">
        <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 pointer-events-none" />
        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/25">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  {UI_LABELS.ORDERS.MY_ORDERS}
                </h1>
                <p className="text-sm text-slate-500">{UI_LABELS.ORDERS.MY_ORDERS_SUBTITLE}</p>
              </div>
            </div>
            {!isLoading && orders.length > 0 && (
              <span className="ml-auto px-2.5 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-md">
                {orders.length}{" "}
                {orders.length !== 1 ? UI_LABELS.ORDERS.ORDERS_PLURAL : UI_LABELS.ORDERS.ORDER}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <div className="relative overflow-hidden rounded-lg p-8 bg-red-50 border border-red-200 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            >
              {UI_LABELS.ORDERS.TRY_AGAIN}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
