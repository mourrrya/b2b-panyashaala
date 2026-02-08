/**
 * Product Constants
 * =================
 * Contains product categories and descriptions.
 */

import { ProductCategory } from "@/prisma/generated/prisma/client";

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export const PRODUCT_CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  ESSENTIAL_OIL: "Therapeutic-grade oils for active performance and signature fragrance.",
  FIXED_OIL: "Stable oils delivering emolliency, conditioning, and skin barrier support.",
  EXTRACT: "Dry, water, and oil-soluble actives for targeted performance.",
  HYDROSOL: "Gentle waters and distillates for toners, mists, and rinse-off bases.",
  CHEMICALS: "Chemicals for various applications and formulations.",
  DRY_EXTRACT: "Dry extracts for concentrated active performance in powders and capsules.",
  FRAGRANCE_OIL: "Fragrance oils for signature scents and aromatic formulations.",
  POWDER_EXTRACT: "Powdered extracts for stable incorporation of actives in solid formats.",
  HERBAL_OILS: "Herbal oils infused with botanical actives for enhanced performance.",
  POWDER: "Powdered ingredients for versatile formulation applications.",
} as const;

// =============================================================================
// CATEGORY LABELS MAP
// =============================================================================

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  ESSENTIAL_OIL: "Essential Oils",
  FIXED_OIL: "Fixed/Carrier Oils",
  EXTRACT: "Plant Extracts",
  HYDROSOL: "Hydrosols",
  CHEMICALS: "Chemicals",
  DRY_EXTRACT: "Dry Extracts",
  FRAGRANCE_OIL: "Fragrance Oils",
  POWDER_EXTRACT: "Powdered Extracts",
  HERBAL_OILS: "Herbal Oils",
  POWDER: "Powders",
} as const;

// =============================================================================
// FUSE SEARCH CONFIGURATION
// =============================================================================

export const FUSE_CONFIG = {
  SEARCH_KEYS: ["name", "description", "inci", "applications"],

  SEARCH_THRESHOLD: 0.4,

  INCLUDE_SCORE: true,
} as const;

// =============================================================================
// LOCAL STORAGE CONFIGURATION
// =============================================================================

export const STORAGE_CONFIG = {
  BASKET_KEY: "aukra_basket",
} as const;

// =============================================================================
// STORE BEHAVIOR CONFIGURATION
// =============================================================================

export const STORE_CONFIG = {
  OPTIMISTIC_UPDATE_DELAY: 100,
} as const;

// =============================================================================
// PAGINATION CONFIGURATION
// =============================================================================

export const PAGINATION_CONFIG = {
  /** Number of products to load per page */
  PRODUCTS_PER_PAGE: 12,
  /** Debounce delay (ms) for search input before triggering API call */
  SEARCH_DEBOUNCE_MS: 400,
  /** Intersection observer threshold for infinite scroll trigger */
  SCROLL_THRESHOLD: 0.1,
  /** Distance from the bottom (in pixels) to trigger next page load */
  SCROLL_ROOT_MARGIN: "200px",
} as const;
