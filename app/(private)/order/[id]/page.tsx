"use client";

import { API_CONFIG, ERROR_MESSAGES, UI_LABELS } from "@/lib/constants";
import { GST_SLAB_PERCENT_MAP } from "@/lib/utils";
import { OrderItemDetails, OrderWithDetails } from "@/types/order";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  MapPin,
  Package,
  Receipt,
  ReceiptIndianRupee,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Status configuration with colors and icons
const orderStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string; icon: typeof Clock }
> = {
  PENDING: {
    label: UI_LABELS.ORDERS.STATUS.PENDING,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: UI_LABELS.ORDERS.STATUS.CONFIRMED,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: UI_LABELS.ORDERS.STATUS.PROCESSING,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
    icon: Package,
  },
  SHIPPED: {
    label: UI_LABELS.ORDERS.STATUS.SHIPPED,
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: UI_LABELS.ORDERS.STATUS.DELIVERED,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: UI_LABELS.ORDERS.STATUS.CANCELLED,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

const paymentStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
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

function StatusBadge({
  status,
  type,
  size = "default",
}: {
  status: string;
  type: "order" | "payment";
  size?: "default" | "large";
}) {
  const config =
    type === "order" ? orderStatusConfig[status] : paymentStatusConfig[status];
  if (!config) return null;

  const Icon = type === "order" ? orderStatusConfig[status]?.icon : null;

  const sizeClasses =
    size === "large"
      ? "px-4 py-2 text-sm gap-2"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${config.bgColor} ${config.color} ${sizeClasses}`}
    >
      {Icon && (
        <Icon className={size === "large" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      )}
      {config.label}
    </span>
  );
}

function OrderItemCard({
  item,
  onDownloadCOA,
}: {
  item: OrderItemDetails;
  onDownloadCOA: (batchNumber: string) => void;
}) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const itemTotal = item.unitPrice * item.quantity + item.taxAmount;

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70
        border border-slate-200/60
        shadow-[0_2px_8px_-2px_rgba(51,65,85,0.08)]
        p-4
      `}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-800 capitalize">
                {item.productName.toLocaleLowerCase()}{" "}
                {item.productCategory.toLocaleLowerCase().split("_").join(" ")}
              </h4>
              {/* <p className="text-sm text-slate-500 mt-0.5">
                {item.variantName}
              </p> */}
            </div>
            <button
              onClick={() => onDownloadCOA(item.batchNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              {UI_LABELS.ORDERS.DOWNLOAD_COA}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-2 bg-slate-50/80 rounded-md border border-slate-100">
              <p className="text-xs text-slate-500">
                {UI_LABELS.ORDERS.BATCH_NO}
              </p>
              <p className="font-medium text-slate-700 text-sm">
                {item.batchNumber}
              </p>
            </div>
            <div className="p-2 bg-slate-50/80 rounded-md border border-slate-100">
              <p className="text-xs text-slate-500">
                {UI_LABELS.ORDERS.HSN_CODE}
              </p>
              <p className="font-medium text-slate-700 text-sm">
                {item.hsnCode}
              </p>
            </div>
            <div className="p-2 bg-slate-50/80 rounded-md border border-slate-100">
              <p className="text-xs text-slate-500">
                {UI_LABELS.ORDERS.NET_CONTENT}
              </p>
              <p className="font-medium text-slate-700 text-sm">
                {item.netContent} {item.measurementUnit}
              </p>
            </div>
            <div className="p-2 bg-slate-50/80 rounded-md border border-slate-100">
              <p className="text-xs text-slate-500">
                {UI_LABELS.ORDERS.GST_SLAB}
              </p>
              <p className="font-medium text-slate-700 text-sm">
                {GST_SLAB_PERCENT_MAP[item.gstSlab]}%
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
            <span>
              {UI_LABELS.ORDERS.MFG_DATE}: {formatDate(item.mfgDate)}
            </span>
            <span>
              {UI_LABELS.ORDERS.EXP_DATE}: {formatDate(item.expiryDate)}
            </span>
          </div>
        </div>

        <div className="lg:w-48 lg:text-right lg:border-l lg:border-slate-200/60 lg:pl-4">
          <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
            <div>
              <p className="text-xs text-slate-500">
                {UI_LABELS.ORDERS.UNIT_PRICE}
              </p>
              <p className="font-semibold text-slate-800">
                ₹{item.unitPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{UI_LABELS.ORDERS.QTY}</p>
              <p className="font-semibold text-slate-800">{item.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{UI_LABELS.ORDERS.TAX}</p>
              <p className="font-semibold text-slate-800">
                ₹{item.taxAmount.toFixed(2)}
              </p>
            </div>
            <div className="lg:pt-2 lg:border-t lg:border-slate-200/60 lg:mt-2">
              <p className="text-xs text-slate-500">{UI_LABELS.ORDERS.TOTAL}</p>
              <p className="font-bold text-lg text-slate-800">
                ₹{itemTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressCard({
  title,
  address,
  icon: Icon,
}: {
  title: string;
  address: OrderWithDetails["shippingAddress"] | null;
  icon: typeof MapPin;
}) {
  if (!address) {
    return (
      <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <h5 className="font-semibold text-slate-700 text-sm">{title}</h5>
        </div>
        <p className="text-sm text-slate-400">
          {UI_LABELS.ORDERS.NOT_PROVIDED}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-linear-to-br from-slate-100 to-slate-200/80">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <h5 className="font-semibold text-slate-700">{title}</h5>
      </div>
      <div className="space-y-1 text-sm text-slate-600">
        <p className="font-medium text-slate-800">{address.street}</p>
        {address.area && <p>{address.area}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-slate-500 text-xs uppercase tracking-wide">
          {address.country}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="relative bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="relative overflow-hidden rounded-lg p-8 bg-red-50 border border-red-200 text-center max-w-md">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {UI_LABELS.ORDERS.ERROR_LOADING_ORDER}
        </h3>
        <p className="text-red-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/order"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            {UI_LABELS.ORDERS.BACK_TO_ORDERS}
          </Link>
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            {UI_LABELS.ORDERS.TRY_AGAIN}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(UI_LABELS.ORDERS.ORDER_NOT_FOUND);
        }
        throw new Error(UI_LABELS.ORDERS.FETCH_ERROR);
      }
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        throw new Error(data.error || UI_LABELS.ORDERS.FETCH_ERROR);
      }
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadInvoice = () => {
    alert(
      `Invoice download for order ${order?.orderNumber} - This feature will generate a PDF invoice`,
    );
  };

  const handleDownloadCOA = (batchNumber: string) => {
    alert(
      `COA download for batch ${batchNumber} - This feature will download the Certificate of Analysis`,
    );
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchOrder} />;
  if (!order)
    return (
      <ErrorState
        message={UI_LABELS.ORDERS.ORDER_NOT_FOUND}
        onRetry={fetchOrder}
      />
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="relative bg-white border-b border-slate-200/60 shadow-sm">
        <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 pointer-events-none" />
        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Link
                href="/order"
                className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/25">
                    <ReceiptIndianRupee className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    {order.orderNumber}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <StatusBadge status={order.status} type="order" size="large" />
              <StatusBadge
                status={order.paymentStatus}
                type="payment"
                size="large"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Order Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-linear-to-br from-slate-100 to-slate-200/80">
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                </div>
                <h2 className="font-bold text-slate-800">
                  {UI_LABELS.ORDERS.ORDER_ITEMS}
                </h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {order.orderItems.length}
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  onDownloadCOA={handleDownloadCOA}
                />
              ))}
            </div>

            {order.notes && (
              <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-100">
                <h5 className="font-semibold text-amber-800 text-sm mb-1">
                  {UI_LABELS.ORDERS.ORDER_NOTES}
                </h5>
                <p className="text-sm text-amber-700">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary & Actions */}
          <div className="space-y-4">
            {/* Order Summary Card */}
            <div
              className={`
                relative overflow-hidden rounded-lg
                bg-linear-to-br from-white/95 via-slate-50/85 to-slate-100/75
                backdrop-blur-sm
                border border-slate-200/60
                shadow-[0_4px_16px_-4px_rgba(51,65,85,0.12)]
              `}
            >
              <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />

              <div className="p-4 border-b border-slate-200/60">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  {UI_LABELS.ORDERS.ORDER_SUMMARY}
                </h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    {UI_LABELS.ORDERS.SUBTOTAL}
                  </span>
                  <span className="font-medium text-slate-700">
                    ₹{order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{UI_LABELS.ORDERS.TAX}</span>
                  <span className="font-medium text-slate-700">
                    ₹{order.totalTax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    {UI_LABELS.ORDERS.SHIPPING}
                  </span>
                  <span className="font-medium text-slate-700">
                    ₹{order.shippingCost.toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      {UI_LABELS.ORDERS.DISCOUNT}
                    </span>
                    <span className="font-medium text-emerald-600">
                      -₹{order.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200/60">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">
                      {UI_LABELS.ORDERS.TOTAL}
                    </span>
                    <span className="text-xl font-bold text-slate-800">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  {UI_LABELS.ORDERS.DOWNLOAD_INVOICE}
                </button>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-md bg-linear-to-br from-slate-100 to-slate-200/80">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                </div>
                <h5 className="font-semibold text-slate-700">
                  {UI_LABELS.ORDERS.PAYMENT_METHOD}
                </h5>
              </div>
              <p className="text-sm text-slate-600 capitalize">
                {order.paymentMethod.replace(/_/g, " ")}
              </p>
            </div>

            <AddressCard
              title={UI_LABELS.PROFILE.SHIPPING_ADDRESS}
              address={order.shippingAddress}
              icon={Truck}
            />
            <AddressCard
              title={UI_LABELS.PROFILE.BILLING_ADDRESS}
              address={order.billingAddress}
              icon={MapPin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
