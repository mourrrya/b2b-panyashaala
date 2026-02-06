import { SWRConfiguration } from "swr";

/**
 * Routes Constants
 * ================
 * Centralized route definitions for the application.
 */

// =============================================================================
// API ROUTES
// =============================================================================

export const PUBLIC_ROUTES = {
  // Auth
  AUTH: {
    SESSION: "/auth/session",
    SIGN_IN: "/auth/signin",
    SIGN_OUT: "/auth/signout",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string | number) => `/products/${id}`,
    PAGINATED: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      usage?: string;
      ids?: string[];
    }) => {
      if (!params) return "/products";
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

  // Services
  SERVICES: "/services",

  // Turnstile verification
  VERIFY_TURNSTILE: "/verify-turnstile",
} as const;

export const PRIVATE_ROUTES = {
  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
  },

  // Profile
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
// ROUTE CONFIGURATIONS
// =============================================================================

export const ROUTE_CONFIG = {
  /** Routes that require authentication */
  PROTECTED: ["/profile", "/order"],

  /** Routes that redirect authenticated users */
  AUTH_ONLY: ["/login"],

  /** Routes disallowed for robots */
  ROBOTS_DISALLOW: ["/api/", "/admin/", "/_private/"],
} as const;

// =============================================================================
// PRODUCT CATEGORY ROUTES
// =============================================================================

export const CATEGORY_ROUTES = {
  ESSENTIAL_OILS: "/products?category=essential-oil",
  FIXED_OILS: "/products?category=fixed-oil",
  EXTRACTS: "/products?category=extract",
  HYDROSOLS: "/products?category=hydrosol",
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
