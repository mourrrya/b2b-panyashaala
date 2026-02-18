"use client";

import { PRIVATE_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import { Address, Customer } from "@/prisma/generated/prisma/browser";
import { GetServerRes } from "@/types/api.payload.types";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR, { KeyedMutator, SWRConfig } from "swr";
import { api, apiClient, swrFetcher } from "../api/axios";

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
  refetch: KeyedMutator<GetServerRes<ProfileData>>;
  updateProfile: (data: Partial<Customer>) => Promise<GetServerRes<ProfileData>>;
  uploadAvatar: (file: File) => Promise<GetServerRes<ProfileData>>;
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
  const { update } = useSession();
  const { data, error, isLoading, isValidating, mutate } = useSWR<GetServerRes<ProfileData>>(
    PRIVATE_ROUTES.PROFILE,
    swrFetcher,
    SWR_CONFIG,
  );

  const updateProfile = useCallback(
    async (updateData: Partial<Customer>) => {
      const result = await apiClient.patch<GetServerRes<ProfileData>>(
        PRIVATE_ROUTES.PROFILE,
        updateData,
      );
      await mutate();
      return result;
    },
    [mutate],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await api
        .post<GetServerRes<ProfileData>>(PRIVATE_ROUTES.PROFILE_AVATAR, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);

      if (result.success && result.data?.avatarUrl) {
        await update({ user: { image: result.data.avatarUrl } });
      }

      await mutate();
      return result;
    },
    [mutate, update],
  );

  const value = useMemo<ProfileApiContextValue>(
    () => ({
      profile: data?.data,
      isLoading,
      isValidating,
      error,
      refetch: mutate,
      updateProfile,
      uploadAvatar,
      isUpdating: false, // Can be enhanced with local state if needed
    }),
    [data, isLoading, isValidating, error, mutate, updateProfile, uploadAvatar],
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
