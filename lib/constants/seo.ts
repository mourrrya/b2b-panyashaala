/**
 * SEO Constants
 * =============
 * All SEO-related configuration and metadata.
 */

import { SITE_CONFIG, SOCIAL_HANDLES, VERIFICATION_TOKENS } from "./index";

// Re-export site config for SEO usage
export { SITE_CONFIG, SOCIAL_HANDLES, VERIFICATION_TOKENS };

// =============================================================================
// SEO DEFAULTS
// =============================================================================

export const SEO_DEFAULTS = {
  /** Default page title template */
  TITLE_TEMPLATE: `%s | ${SITE_CONFIG.NAME}`,

  /** Default meta robots */
  ROBOTS: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },

  /** Default Open Graph type */
  OG_TYPE: "website" as const,

  /** Image dimensions for Open Graph */
  OG_IMAGE_DIMENSIONS: {
    width: 1200,
    height: 630,
  },

  /** Twitter card type */
  TWITTER_CARD: "summary_large_image" as const,

  /** Default locale */
  LOCALE: "en_US",
} as const;

// =============================================================================
// META KEYWORDS BY PAGE
// =============================================================================

export const META_KEYWORDS = {
  GLOBAL: [
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
  HOME: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "B2B supplier",
    "natural ingredients",
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
  QUALITY: [
    "quality standards",
    "ISO certified",
    "GMP aligned",
    "cosmetic testing",
    "COA",
    "MSDS",
    "traceability",
  ],
  APPLICATIONS: [
    "cosmetic applications",
    "personal care",
    "hair care",
    "skin care",
    "formulation",
  ],
  CONTACT: ["contact", "enquiry", "B2B partnership", "sourcing team"],
} as const;

// =============================================================================
// PAGE METADATA CONFIGURATIONS
// =============================================================================

export const PAGE_SEO = {
  HOME: {
    title:
      "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
    description:
      "B2B natural cosmetic ingredients supplier offering essential oils, carrier oils, botanical extracts, and hydrosols. Serving formulators, manufacturers, and sourcing teams globally with quality-tested, certified ingredients.",
    canonical: "/",
    keywords: META_KEYWORDS.HOME,
  },
  PRODUCTS: {
    title: "Product Catalog | Natural Cosmetic Ingredients",
    description:
      "Browse our complete range of essential oils, carrier oils, botanical extracts, and hydrosols for cosmetic formulations. 400+ products with INCI names and applications.",
    canonical: "/products",
    keywords: META_KEYWORDS.PRODUCTS,
  },
  ABOUT: {
    title: "About Us | Professional Cosmetic Ingredients Supplier",
    description:
      "Learn about our B2B cosmetic ingredients supply network, quality standards, and commitment to supporting formulators and manufacturers with certified botanical products.",
    canonical: "/about",
    keywords: META_KEYWORDS.ABOUT,
  },
  QUALITY: {
    title: "Quality & Sourcing | Certified Cosmetic Ingredients",
    description:
      "Quality-first supply with transparent documentation. ISO and GMP aligned testing standards with complete traceability.",
    canonical: "/quality",
    keywords: META_KEYWORDS.QUALITY,
  },
  APPLICATIONS: {
    title: "Applications | Industries We Serve",
    description:
      "Discover how our natural ingredients are used in personal care, hair care, skin care, and cosmetic formulations.",
    canonical: "/applications",
    keywords: META_KEYWORDS.APPLICATIONS,
  },
  CONTACT: {
    title: "Contact Us | Get in Touch",
    description:
      "Contact our sourcing team for cosmetic ingredients inquiries, custom formulations, and B2B partnerships.",
    canonical: "/contact",
    keywords: META_KEYWORDS.CONTACT,
  },
  PRODUCT_NOT_FOUND: {
    title: "Product Not Found",
    description: "The requested product could not be found.",
    canonical: "/products",
  },
} as const;

// =============================================================================
// STRUCTURED DATA TYPES
// =============================================================================

export const SCHEMA_TYPES = {
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
} as const;
