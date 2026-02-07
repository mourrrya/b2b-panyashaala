/**
 * Authentication & API Constants
 * ==============================
 * Contains auth config, API endpoints, and security settings.
 */

import { NAVIGATION_CONFIG, PUBLIC_NAV } from "./navigation";

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTH_CONFIG = {
  /** Session duration in seconds (30 days) */
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,

  /** Auth pages routes */
  PAGES: {
    SIGN_IN: PUBLIC_NAV.LOGIN,
    ERROR: PUBLIC_NAV.LOGIN,
  },

  /** Protected routes that require authentication (sourced from NAVIGATION_CONFIG) */
  PROTECTED_PAGES: NAVIGATION_CONFIG.PROTECTED,

  /** Auth page that redirect if already logged in (sourced from NAVIGATION_CONFIG) */
  AUTH_PAGE: NAVIGATION_CONFIG.AUTH_ONLY,

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
// TURNSTILE (CLOUDFLARE) CONFIGURATION
// =============================================================================

export const TURNSTILE_CONFIG = {
  VERIFY_URL: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  TEST_TOKEN_PREFIX: "test-token-",
  PLACEHOLDER_KEY: "your_turnstile_site_key",
  PLACEHOLDER_SECRET: "your_turnstile_secret_key",
} as const;
