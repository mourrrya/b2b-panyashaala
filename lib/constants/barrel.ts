/**
 * Constants Module Barrel Export
 * ==============================
 * Central export point for all constants.
 *
 * Usage:
 * import { SITE_CONFIG, ERROR_MESSAGES } from '@/lib/constants';
 *
 * Or import from specific files:
 * import { CLIENT_ROUTES } from '@/lib/constants/navigation';
 * import { VALIDATION_RULES } from '@/lib/constants/validation';
 */

// Site configuration, contact info, social media
export * from "./config";

// Navigation links
export * from "./navigation";

// Product categories and descriptions
export * from "./products";

// Authentication & API configuration
export * from "./auth";

// Error and success messages
export * from "./messages";

// UI labels and text
export * from "./ui-labels";

// Marketing copy and feature highlights
export * from "./marketing";

// Page content (about, quality, FAQ)
export * from "./content";

// Metadata, SEO, and schema config
export * from "./metadata";

// HTTP status codes
export * from "./http";

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
