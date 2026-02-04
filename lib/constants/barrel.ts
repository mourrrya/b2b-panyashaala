/**
 * Constants Module Barrel Export
 * ==============================
 * Central export point for all constants.
 *
 * Usage:
 * import { SITE_CONFIG, ERROR_MESSAGES } from '@/lib/constants';
 *
 * Or import from specific files:
 * import { PUBLIC_ROUTES } from '@/lib/constants/routes';
 * import { VALIDATION_RULES } from '@/lib/constants/validation';
 */

// Main constants
export * from "./index";

// Error handling utilities
export { decodeOAuthError, getTurnstileErrorMessage } from "./errors";

// Route definitions
export * from "./routes";

// Validation rules and utilities
export * from "./validation";

// SEO configuration
export * from "./seo";

// Application categories
export { ApplicationCategory, type Application } from "./applications";
