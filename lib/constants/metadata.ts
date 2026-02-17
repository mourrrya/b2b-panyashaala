/**
 * Metadata & SEO Constants
 * ========================
 * Contains schema config, animation timings, and email defaults.
 * Page-level SEO config is in `lib/constants/seo.ts`.
 */

// =============================================================================
// ANIMATION TIMINGS (ms)
// =============================================================================

export const ANIMATION_TIMINGS = {
  /** Success message auto-hide duration */
  SUCCESS_MESSAGE_DURATION: 5000,

  /** Fade-in delay per item */
  FADE_IN_DELAY: 100,
} as const;

// =============================================================================
// SCHEMA.ORG CONFIGURATION
// =============================================================================

export const SCHEMA_CONFIG = {
  CONTEXT: "https://schema.org",
  TYPES: {
    ORGANIZATION: "Organization",
    WEBSITE: "WebSite",
    PRODUCT: "Product",
    BREADCRUMB_LIST: "BreadcrumbList",
    ARTICLE: "Article",
    SEARCH_ACTION: "SearchAction",
    ENTRY_POINT: "EntryPoint",
    CONTACT_POINT: "ContactPoint",
    BRAND: "Brand",
    OFFER: "Offer",
    LIST_ITEM: "ListItem",
    PERSON: "Person",
  },
  CONTACT_TYPE: "Customer Service",
  AVAILABILITY: "https://schema.org/InStock",
} as const;

// =============================================================================
// EMAIL TEMPLATE DEFAULTS
// =============================================================================

export const EMAIL_DEFAULTS = {
  NO_PRODUCTS_ENQUIRED: "No products enquired",
  NO_EMAIL_PROVIDED: "No email provided",
  NOT_PROVIDED: "Not provided",
  NO_MESSAGE_PROVIDED: "No message provided",
} as const;
