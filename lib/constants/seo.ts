/**
 * SEO Constants
 * =============
 * All SEO-related configuration and metadata.
 */

import { SITE_CONFIG } from "./config";

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
    "Aukra",
    "Aukra Chem Essentials",
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
    "cosmetic raw materials",
    "wholesale essential oils",
  ],
  HOME: [
    "Aukra",
    "Aukra Chem Essentials",
    "cosmetic ingredients supplier",
    "essential oils wholesale",
    "carrier oils bulk",
    "botanical extracts B2B",
    "natural cosmetic ingredients",
    "ingredient sourcing India",
  ],
  PRODUCTS: [
    "Aukra products",
    "cosmetic ingredients catalog",
    "essential oils list",
    "carrier oils catalog",
    "botanical extracts supplier",
    "hydrosols wholesale",
    "INCI name products",
    "cosmetic raw materials",
  ],
  ABOUT: [
    "Aukra Chem Essentials LLP",
    "about Aukra",
    "B2B cosmetic supplier",
    "cosmetic ingredients company",
    "quality standards",
    "ISO certified ingredients",
    "GMP aligned",
    "botanical products supplier",
  ],
  QUALITY: [
    "Aukra quality",
    "quality standards",
    "ISO certified",
    "GMP aligned",
    "cosmetic testing",
    "certificate of analysis",
    "MSDS",
    "ingredient traceability",
  ],
  APPLICATIONS: [
    "cosmetic applications",
    "personal care ingredients",
    "hair care ingredients",
    "skin care formulation",
    "aromatherapy oils",
  ],
  CONTACT: [
    "contact Aukra",
    "cosmetic ingredients enquiry",
    "B2B partnership",
    "sourcing team",
    "bulk order enquiry",
  ],
} as const;

// =============================================================================
// PAGE METADATA CONFIGURATIONS
// =============================================================================

export const PAGE_SEO = {
  HOME: {
    title: "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
    // FIXME Enhance description by reducing char length of the description
    description:
      "B2B supplier of natural cosmetic ingredients — essential & carrier oils, botanical extracts and hydrosols. Trusted by formulators for certified, tested materials.",
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
