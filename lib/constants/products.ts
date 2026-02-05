/**
 * Product Constants
 * =================
 * Contains product categories and descriptions.
 */

import { ProductCategory } from "@/prisma/generated/prisma/client";

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export const PRODUCT_CATEGORIES: Array<{
  value: ProductCategory;
  label: string;
}> = [
  { value: "ESSENTIAL_OIL", label: "Essential Oils" },
  { value: "FIXED_OIL", label: "Fixed/Carrier Oils" },
  { value: "EXTRACT", label: "Plant Extracts" },
  { value: "HYDROSOL", label: "Hydrosols" },
  { value: "CHEMICALS", label: "Chemicals" },
  { value: "DRY_EXTRACT", label: "Dry Extracts" },
  { value: "FRAGRANCE_OIL", label: "Fragrance Oils" },
  { value: "POWDER_EXTRACT", label: "Powdered Extracts" },
  { value: "HERBAL_OILS", label: "Herbal Oils" },
  { value: "POWDER", label: "Powders" },
] as const;

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
