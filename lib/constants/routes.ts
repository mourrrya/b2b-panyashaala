/**
 * Routes Constants
 * ================
 * Centralized route definitions for the application.
 */

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

export const PUBLIC_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  ABOUT: "/about",
  APPLICATIONS: "/applications",
  QUALITY: "/quality",
  CONTACT: "/contact",
  LOGIN: "/login",
  SITEMAP: "/sitemap.xml",
} as const;

// =============================================================================
// PRIVATE ROUTES (require authentication)
// =============================================================================

export const PRIVATE_ROUTES = {
  PROFILE: "/profile",
  ORDERS: "/order",
  ORDER_DETAIL: (id: string) => `/order/${id}`,
} as const;

// =============================================================================
// API ROUTES
// =============================================================================

export const API_ROUTES = {
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

// =============================================================================
// BREADCRUMB DEFINITIONS
// =============================================================================

export const BREADCRUMBS = {
  HOME: { name: "Home", path: "/" },
  PRODUCTS: { name: "Products", path: "/products" },
  ABOUT: { name: "About", path: "/about" },
  APPLICATIONS: { name: "Applications", path: "/applications" },
  QUALITY: { name: "Quality", path: "/quality" },
  CONTACT: { name: "Contact", path: "/contact" },
} as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};
