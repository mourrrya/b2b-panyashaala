import { SWRConfiguration } from "swr";

// =============================================================================
// SWR GLOBAL CONFIGURATION
// =============================================================================

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
};

// =============================================================================
// CACHE KEY FACTORIES
// =============================================================================

export const apiKeys = {
  // Products
  products: {
    list: () => "/products" as const,
    detail: (id: string | number) => `/products/${id}` as const,
  },

  // Profile
  profile: {
    me: () => "/profile" as const,
  },

  // Orders
  orders: {
    list: () => "/orders" as const,
    detail: (id: string | number) => `/orders/${id}` as const,
  },
} as const;
