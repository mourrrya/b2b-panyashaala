/**
 * Authentication & API Constants
 * ==============================
 * Contains auth config, API endpoints, and security settings.
 */

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTH_CONFIG = {
  /** Session duration in seconds (30 days) */
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,

  /** Auth pages routes */
  PAGES: {
    SIGN_IN: "/login",
    ERROR: "/login",
  },

  /** Protected routes that require authentication */
  PROTECTED_ROUTES: ["/profile", "/orders"],

  /** Auth routes that redirect if already logged in */
  AUTH_ROUTES: ["/login"],

  /** Password requirements */
  PASSWORD_MIN_LENGTH: 8,

  /** Avatar upload constraints */
  AVATAR: {
    ALLOWED_FILE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    MAX_FILE_SIZE: 200 * 1024, // 200KB in bytes
    ACCEPTED_EXTENSIONS: ".png,.jpg,.jpeg,.webp",
  },
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  /** Base URL for API requests */
  BASE_URL: "/api",

  /** API endpoints */
  ENDPOINTS: {
    PROFILE: "/api/profile",
    PRODUCTS: "/api/products",
    ORDERS: "/api/orders",
    VERIFY_TURNSTILE: "/api/verify-turnstile",
  },

  /** Robots disallowed paths */
  ROBOTS_DISALLOW: ["/api/", "/admin/", "/_private/"],
} as const;

// =============================================================================
// TURNSTILE (CLOUDFLARE) CONFIGURATION
// =============================================================================

export const TURNSTILE_CONFIG = {
  VERIFY_URL: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  TEST_TOKEN_PREFIX: "test-token-",
  PLACEHOLDER_KEY: "your_turnstile_site_key",
  PLACEHOLDER_SECRET: "your_turnstile_secret_key",
} as const;
