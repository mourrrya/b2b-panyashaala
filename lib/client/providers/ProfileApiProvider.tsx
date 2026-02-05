"use client";

import { PRIVATE_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { Address, Customer } from "@/prisma/generated/prisma/browser";
import { SuccessRes } from "@/types/api.payload.types";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR, { KeyedMutator, SWRConfig } from "swr";
import { apiClient, swrFetcher } from "../api/axios";

// =============================================================================
// TYPES
// =============================================================================

export type ProfileData = Customer & {
  _count?: { orders: number };
  addresses: Address[];
};

interface ProfileApiContextValue {
  profile: ProfileData | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  refetch: KeyedMutator<SuccessRes<ProfileData>>;
  updateProfile: (data: Partial<Customer>) => Promise<SuccessRes<ProfileData>>;
  isUpdating: boolean;
}

const ProfileApiContext = createContext<ProfileApiContextValue | undefined>(undefined);

// =============================================================================
// PROFILE PROVIDER
// =============================================================================

interface ProfileApiProviderProps {
  children: ReactNode;
}

export function ProfileApiProvider({ children }: ProfileApiProviderProps) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<SuccessRes<ProfileData>>(
    PRIVATE_ROUTES.PROFILE,
    swrFetcher,
    SWR_CONFIG,
  );

  const updateProfile = useCallback(
    async (updateData: Partial<Customer>) => {
      const result = await apiClient.patch<SuccessRes<ProfileData>>(
        PRIVATE_ROUTES.PROFILE,
        updateData,
      );
      await mutate();
      return result;
    },
    [mutate],
  );

  const value = useMemo<ProfileApiContextValue>(
    () => ({
      profile: data?.data,
      isLoading,
      isValidating,
      error,
      refetch: mutate,
      updateProfile,
      isUpdating: false, // Can be enhanced with local state if needed
    }),
    [data, isLoading, isValidating, error, mutate, updateProfile],
  );

  return (
    <SWRConfig value={SWR_CONFIG}>
      <ProfileApiContext.Provider value={value}>{children}</ProfileApiContext.Provider>
    </SWRConfig>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useApiProfile(): ProfileApiContextValue {
  const context = useContext(ProfileApiContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
