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
    SESSION: "/api/auth/session",
    SIGN_IN: "/api/auth/signin",
    SIGN_OUT: "/api/auth/signout",
  },

  // Profile
  PROFILE: "/api/profile",

  // Products
  PRODUCTS: {
    LIST: "/api/products",
    DETAIL: (id: string | number) => `/api/products/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: "/api/orders",
    DETAIL: (id: string) => `/api/orders/${id}`,
  },

  // Services
  SERVICES: "/api/services",

  // Turnstile verification
  VERIFY_TURNSTILE: "/api/verify-turnstile",
} as const;

export const PRIVATE_ROUTES = {
  PROFILE: "/api/profile",
  ORDERS: "/api/orders",
} as const;

// =============================================================================
// EXTERNAL LINKS
// =============================================================================

export const EXTERNAL_LINKS = {
  CLOUDFLARE_TURNSTILE:
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
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
