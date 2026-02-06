"use client";

import { swrFetcher } from "@/lib/client/api/axios";
import { PUBLIC_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { ProductCategory } from "@/prisma/generated/prisma/client";
import { GetServerRes } from "@/types/api.payload.types";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface CategoriesContextValue {
  categories: ProductCategory[];
  isLoading: boolean;
  error: Error | undefined;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

export function CategoriesApiProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useSWR<GetServerRes<ProductCategory[]>>(
    PUBLIC_ROUTES.CATEGORIES,
    swrFetcher,
    SWR_CONFIG,
  );

  const value: CategoriesContextValue = {
    categories: data?.data ?? [],
    isLoading,
    error,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useApiCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useApiCategories must be used within CategoriesApiProvider");
  }
  return context;
}
