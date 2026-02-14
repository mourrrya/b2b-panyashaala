"use client";

import { CollectionListItem } from "@/app/api/services/collectionServices";
import { swrFetcher } from "@/lib/client/api/axios";
import { PAGINATION_CONFIG } from "@/lib/constants/products";
import { PUBLIC_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { GetServerListRes, GetServerRes } from "@/types/api.payload.types";
import { ProductWithVariantsImages } from "@/types/product";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR, { SWRConfig } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

// =============================================================================
// COLLECTIONS LIST CONTEXT
// =============================================================================

interface CollectionsApiContextValue {
  collections: CollectionListItem[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

const CollectionsApiContext = createContext<CollectionsApiContextValue | undefined>(undefined);

export function CollectionsApiProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<GetServerRes<CollectionListItem[]>>(
    PUBLIC_ROUTES.COLLECTIONS.LIST,
    swrFetcher,
    SWR_CONFIG,
  );

  const value = useMemo<CollectionsApiContextValue>(
    () => ({
      collections: data?.data ?? [],
      isLoading,
      error,
      refetch: () => mutate(),
    }),
    [data, isLoading, error, mutate],
  );

  return (
    <SWRConfig value={SWR_CONFIG}>
      <CollectionsApiContext.Provider value={value}>{children}</CollectionsApiContext.Provider>
    </SWRConfig>
  );
}

export function useApiCollections(): CollectionsApiContextValue {
  const context = useContext(CollectionsApiContext);
  if (context === undefined) {
    throw new Error("useApiCollections must be used within a CollectionsApiProvider");
  }
  return context;
}

// =============================================================================
// COLLECTION PRODUCTS CONTEXT (Infinite Pagination)
// =============================================================================

interface CollectionProductsResponse extends GetServerListRes<ProductWithVariantsImages[]> {
  collection?: { id: string; name: string; description: string | null };
}

interface CollectionProductsApiContextValue {
  collection: { id: string; name: string; description: string | null } | undefined;
  products: ProductWithVariantsImages[];
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  totalProducts: number;
  hasMore: boolean;
  loadNextPage: () => void;
  isLoadingMore: boolean;
  refetch: () => Promise<CollectionProductsResponse[] | undefined>;
}

const CollectionProductsApiContext = createContext<CollectionProductsApiContextValue | undefined>(
  undefined,
);

interface CollectionProductsApiProviderProps {
  children: ReactNode;
  collectionName: string;
}

export function CollectionProductsApiProvider({
  children,
  collectionName,
}: CollectionProductsApiProviderProps) {
  const limit = PAGINATION_CONFIG.COLLECTION_PRODUCTS_PER_PAGE;

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previousPageData: CollectionProductsResponse | null) => {
      if (previousPageData && (!previousPageData.data || previousPageData.data.length < limit)) {
        return null;
      }

      return PUBLIC_ROUTES.COLLECTIONS.PRODUCTS(collectionName, {
        page: pageIndex + 1,
        limit,
      });
    },
    [collectionName, limit],
  );

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<CollectionProductsResponse>(getKey, swrFetcher, {
      ...SWR_CONFIG,
      revalidateFirstPage: false,
      revalidateAll: false,
      persistSize: false,
      parallel: false,
    });

  const value = useMemo<CollectionProductsApiContextValue>(() => {
    const products = data?.flatMap((page) => page.data ?? []) ?? [];
    const collection = data?.[0]?.collection;
    const totalProducts = data?.[0]?.pagination?.total ?? 0;
    const totalPages = data?.[0]?.pagination?.totalPages ?? 0;
    const isLoadingMore = size > 0 && data !== undefined && typeof data[size - 1] === "undefined";
    const hasMore = size < totalPages;

    return {
      collection,
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
      <CollectionProductsApiContext.Provider value={value}>
        {children}
      </CollectionProductsApiContext.Provider>
    </SWRConfig>
  );
}

export function useApiCollectionProducts(): CollectionProductsApiContextValue {
  const context = useContext(CollectionProductsApiContext);
  if (context === undefined) {
    throw new Error("useApiCollectionProducts must be used within a CollectionProductsApiProvider");
  }
  return context;
}
