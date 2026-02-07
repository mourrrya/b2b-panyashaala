import { SWRConfiguration } from "swr";

/**
 * Routes Constants
 * ================
 * Centralized route definitions for the application.
 */

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  BASE_URL: "/api",
  TIMEOUT: 60000, // 60 seconds
} as const;

// =============================================================================
// API ROUTES
// =============================================================================

export const PUBLIC_ROUTES = {
  AUTH: {
    SESSION: "/auth/session",
    SIGN_IN: "/auth/signin",
    SIGN_OUT: "/auth/signout",
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string | number) => `${PUBLIC_ROUTES.PRODUCTS.LIST}/${id}`,
    PAGINATED: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      usage?: string;
      ids?: string[];
    }) => {
      if (!params) return `${PUBLIC_ROUTES.PRODUCTS.LIST}`;
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.search) query.set("search", params.search);
      if (params.category) query.set("category", params.category);
      if (params.usage) query.set("usage", params.usage);
      if (params.ids?.length) query.set("ids", params.ids.join(","));
      const qs = query.toString();
      return qs ? `/products?${qs}` : "/products";
    },
  },

  CATEGORIES: "/categories",

  VERIFY_TURNSTILE: "/verify-turnstile",
} as const;

export const PRIVATE_ROUTES = {
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `${PRIVATE_ROUTES.ORDERS.LIST}/${id}`,
  },

  PROFILE: "/profile",
} as const;

// =============================================================================
// EXTERNAL LINKS
// =============================================================================

export const EXTERNAL_LINKS = {
  CLOUDFLARE_TURNSTILE: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  TURNSTILE_SCRIPT: "https://challenges.cloudflare.com/turnstile/v0/api.js",
} as const;

// =============================================================================
// SWR GLOBAL CONFIGURATION
// =============================================================================

export const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
};
