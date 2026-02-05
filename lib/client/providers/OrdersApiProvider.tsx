"use client";

import { Order } from "@/prisma/generated/prisma/browser";
import { SuccessRes } from "@/types/api.payload.types";
import { createContext, ReactNode, useContext, useMemo } from "react";
import useSWR, { KeyedMutator, SWRConfig } from "swr";
import { swrFetcher } from "../api/axios";
import { apiKeys, swrConfig } from "../api/swr-config";

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface OrdersApiContextValue {
  orders: Order[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<SuccessRes<Order[]>>;
}

interface OrderApiContextValue {
  order: Order | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<SuccessRes<Order>>;
}

const OrdersApiContext = createContext<OrdersApiContextValue | undefined>(
  undefined,
);
const OrderApiContext = createContext<OrderApiContextValue | undefined>(
  undefined,
);

// =============================================================================
// ORDERS PROVIDER (List)
// =============================================================================

interface OrdersApiProviderProps {
  children: ReactNode;
}

export function OrdersApiProvider({ children }: OrdersApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SuccessRes<Order[]>
  >(apiKeys.orders.list(), swrFetcher, swrConfig);

  const value = useMemo<OrdersApiContextValue>(
    () => ({
      orders: data?.data ?? [],
      isLoading,
      isValidating,
      error,
      refetch: mutate,
    }),
    [data, isLoading, isValidating, error, mutate],
  );

  return (
    <SWRConfig value={swrConfig}>
      <OrdersApiContext.Provider value={value}>
        {children}
      </OrdersApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// ORDER PROVIDER (Single)
// =============================================================================

interface OrderApiProviderProps {
  children: ReactNode;
  orderId: string | number;
}

export function OrderApiProvider({ children, orderId }: OrderApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SuccessRes<Order>
  >(orderId ? apiKeys.orders.detail(orderId) : null, swrFetcher, swrConfig);

  const value = useMemo<OrderApiContextValue>(
    () => ({
      order: data?.data,
      isLoading,
      isValidating,
      error,
      refetch: mutate,
    }),
    [data, isLoading, isValidating, error, mutate],
  );

  return (
    <SWRConfig value={swrConfig}>
      <OrderApiContext.Provider value={value}>
        {children}
      </OrderApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useApiOrders(): OrdersApiContextValue {
  const context = useContext(OrdersApiContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}

export function useApiOrder(): OrderApiContextValue {
  const context = useContext(OrderApiContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
