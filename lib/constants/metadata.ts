/**
 * Metadata & SEO Constants
 * ========================
 * Contains SEO keywords, page metadata, schema config, and animation timings.
 */

// =============================================================================
// SEO KEYWORDS
// =============================================================================

export const SEO_KEYWORDS = {
  HOME: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "hydrosols",
    "B2B supplier",
    "natural ingredients",
    "cosmetic formulations",
    "contract manufacturer",
    "ingredient sourcing",
  ],
  PRODUCTS: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "hydrosols",
    "product catalog",
    "cosmetic supplier",
    "ingredient sourcing",
  ],
  ABOUT: [
    "about us",
    "B2B supplier",
    "cosmetic ingredients",
    "quality standards",
    "ISO certified",
    "GMP aligned",
    "sourcing network",
    "botanical products",
  ],
} as const;

// =============================================================================
// PAGE METADATA
// =============================================================================

export const PAGE_METADATA = {
  HOME: {
    TITLE:
      "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
    DESCRIPTION:
      "B2B natural cosmetic ingredients supplier offering essential oils, carrier oils, botanical extracts, and hydrosols. Serving formulators, manufacturers, and sourcing teams globally with quality-tested, certified ingredients.",
  },
  PRODUCTS: {
    TITLE: "Product Catalog | Natural Cosmetic Ingredients",
    DESCRIPTION:
      "Browse our complete range of essential oils, carrier oils, botanical extracts, and hydrosols for cosmetic formulations. 400+ products with INCI names and applications.",
  },
  ABOUT: {
    TITLE: "About Us | Professional Cosmetic Ingredients Supplier",
    DESCRIPTION:
      "Learn about our B2B cosmetic ingredients supply network, quality standards, and commitment to supporting formulators and manufacturers with certified botanical products.",
  },
  CONTACT: {
    TITLE: "Contact Us | Get in Touch",
    DESCRIPTION:
      "Contact our sourcing team for cosmetic ingredients inquiries, custom formulations, and B2B partnerships.",
  },
} as const;

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
