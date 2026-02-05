"use client";

import { SuccessRes } from "@/types/api.payload.types";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { createContext, ReactNode, useContext, useMemo } from "react";
import useSWR, { KeyedMutator, SWRConfig } from "swr";
import { swrFetcher } from "../api/axios";
import { apiKeys, swrConfig } from "../api/swr-config";

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface ProductsApiContextValue {
  products: ProductWithVariantsImagesReviews[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<SuccessRes<ProductWithVariantsImagesReviews[]>>;
}

interface ProductApiContextValue {
  product: ProductWithVariantsImagesReviews | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<SuccessRes<ProductWithVariantsImagesReviews>>;
}

const ProductsApiContext = createContext<ProductsApiContextValue | undefined>(
  undefined,
);
const ProductApiContext = createContext<ProductApiContextValue | undefined>(
  undefined,
);

// =============================================================================
// PRODUCTS PROVIDER (List)
// =============================================================================

interface ProductsApiProviderProps {
  children: ReactNode;
}

export function ProductsApiProvider({ children }: ProductsApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SuccessRes<ProductWithVariantsImagesReviews[]>
  >(apiKeys.products.list(), swrFetcher, swrConfig);

  const value = useMemo<ProductsApiContextValue>(
    () => ({
      products: data?.data ?? [],
      isLoading,
      isValidating,
      error,
      refetch: mutate,
    }),
    [data, isLoading, isValidating, error, mutate],
  );

  return (
    <SWRConfig value={swrConfig}>
      <ProductsApiContext.Provider value={value}>
        {children}
      </ProductsApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// PRODUCT PROVIDER (Single)
// =============================================================================

interface ProductApiProviderProps {
  children: ReactNode;
  productId: string | number;
}

export function ProductApiProvider({
  children,
  productId,
}: ProductApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SuccessRes<ProductWithVariantsImagesReviews>
  >(
    productId ? apiKeys.products.detail(productId) : null,
    swrFetcher,
    swrConfig,
  );

  const value = useMemo<ProductApiContextValue>(
    () => ({
      product: data?.data,
      isLoading,
      isValidating,
      error,
      refetch: mutate,
    }),
    [data, isLoading, isValidating, error, mutate],
  );

  return (
    <SWRConfig value={swrConfig}>
      <ProductApiContext.Provider value={value}>
        {children}
      </ProductApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useApiProducts(): ProductsApiContextValue {
  const context = useContext(ProductsApiContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

export function useApiProduct(): ProductApiContextValue {
  const context = useContext(ProductApiContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
