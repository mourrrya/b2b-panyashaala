"use client";

import { PAGINATION_CONFIG } from "@/lib/constants/products";
import { PUBLIC_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { GetServerListRes, GetServerRes } from "@/types/api.payload.types";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR, { KeyedMutator, SWRConfig } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { swrFetcher } from "../api/axios";

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface ProductsApiContextValue {
  /** Flattened array of all loaded products across pages */
  products: ProductWithVariantsImagesReviews[];
  /** True only on first page load with no data */
  isLoading: boolean;
  /** True when fetching any page */
  isValidating: boolean;
  /** Error from the latest request */
  error: Error | undefined;
  /** Total number of products matching the current filters */
  totalProducts: number;
  /** Whether there are more pages to load */
  hasMore: boolean;
  /** Load the next page of products */
  loadNextPage: () => void;
  /** True when loading subsequent pages (not the first) */
  isLoadingMore: boolean;
  /** Re-fetch all loaded pages */
  refetch: () => Promise<GetServerListRes<ProductWithVariantsImagesReviews[]>[] | undefined>;
}

interface ProductApiContextValue {
  product: ProductWithVariantsImagesReviews | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<GetServerRes<ProductWithVariantsImagesReviews>>;
}

const ProductsApiContext = createContext<ProductsApiContextValue | undefined>(undefined);
const ProductApiContext = createContext<ProductApiContextValue | undefined>(undefined);

// =============================================================================
// PRODUCTS PROVIDER (Infinite Pagination)
// =============================================================================

interface ProductsApiProviderProps {
  children: ReactNode;
  search?: string;
  category?: string | null;
  usage?: string | null;
}

export function ProductsApiProvider({
  children,
  search,
  category,
  usage,
}: ProductsApiProviderProps) {
  const limit = PAGINATION_CONFIG.PRODUCTS_PER_PAGE;

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (
      pageIndex: number,
      previousPageData: GetServerListRes<ProductWithVariantsImagesReviews[]> | null,
    ) => {
      // If previous page returned no data or less than limit, we're done
      if (previousPageData && (!previousPageData.data || previousPageData.data.length < limit)) {
        return null;
      }

      return PUBLIC_ROUTES.PRODUCTS.PAGINATED({
        page: pageIndex + 1,
        limit,
        search: search || undefined,
        category: category || undefined,
        usage: usage || undefined,
      });
    },
    [search, category, usage, limit],
  );

  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<
    GetServerListRes<ProductWithVariantsImagesReviews[]>
  >(getKey, swrFetcher, {
    ...SWR_CONFIG,
    revalidateFirstPage: false,
    revalidateAll: false,
    persistSize: false,
    parallel: false,
  });

  const value = useMemo<ProductsApiContextValue>(() => {
    const products = data?.flatMap((page) => page.data ?? []) ?? [];
    const totalProducts = data?.[0]?.pagination?.total ?? 0;
    const totalPages = data?.[0]?.pagination?.totalPages ?? 0;
    const isLoadingMore = size > 0 && data !== undefined && typeof data[size - 1] === "undefined";
    const hasMore = size < totalPages;

    return {
      products,
      isLoading,
      isValidating,
      error,
      totalProducts,
      hasMore,
      isLoadingMore: isLoadingMore ?? false,
      loadNextPage: () => setSize((s) => s + 1),
      refetch: mutate,
    };
  }, [data, isLoading, isValidating, error, size, setSize, mutate]);

  return (
    <SWRConfig value={SWR_CONFIG}>
      <ProductsApiContext.Provider value={value}>{children}</ProductsApiContext.Provider>
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

export function ProductApiProvider({ children, productId }: ProductApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    GetServerRes<ProductWithVariantsImagesReviews>
  >(productId ? PUBLIC_ROUTES.PRODUCTS.DETAIL(productId) : null, swrFetcher, SWR_CONFIG);

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
    <SWRConfig value={SWR_CONFIG}>
      <ProductApiContext.Provider value={value}>{children}</ProductApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useApiProducts(): ProductsApiContextValue {
  const context = useContext(ProductsApiContext);
  if (context === undefined) {
    throw new Error("useApiProducts must be used within a ProductsApiProvider");
  }
  return context;
}

export function useApiProduct(): ProductApiContextValue {
  const context = useContext(ProductApiContext);
  if (context === undefined) {
    throw new Error("useApiProduct must be used within a ProductApiProvider");
  }
  return context;
}
