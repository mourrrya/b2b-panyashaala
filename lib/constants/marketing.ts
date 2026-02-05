/**
 * Marketing & Business Constants
 * ==============================
 * Contains marketing copy, feature highlights, and business information.
 */

// =============================================================================
// BRANDING & MARKETING COPY
// =============================================================================

export const MARKETING_COPY = {
  TAGLINE: "Nature-powered actives for modern cosmetic formulations",
  HERO_SUBTITLE:
    "Essential oils, carrier oils, botanical extracts, and hydrosols curated for formulators, manufacturers, and sourcing teams. Bridging traditional botanicals with contemporary cosmetic science.",
  FOOTER_ABOUT:
    "Natural cosmetic ingredients supplier for formulators and manufacturers.",
  LOGIN_TAGLINE: "Nature's finest, crafted for excellence",
  LOGIN_SUBTITLE:
    "Access our curated collection of essential oils, botanical extracts, and natural ingredients. Login to explore exclusive B2B pricing and place orders.",
  LOGIN_QUOTE:
    "Bridging traditional botanicals with contemporary cosmetic science.",
  ABOUT_INTRO:
    "We are a newly launched yet deeply networked B2B supplier dedicated to the cosmetic and personal care industry. Our sourcing partners span certified distillers, seed crushers, and botanical processors with strict cosmetic-grade controls.",
  ABOUT_SUPPORT:
    "From boutique clean labels to enterprise-scale contract manufacturers, we support your formulation journey with documentation, traceability, and responsive collaboration.",
  CONTACT_INTRO:
    "Have questions about our products or need custom sourcing solutions? Reach out to our team and we'll connect you with the right specialist.",
  CONTACT_SUCCESS: "Thank you! We'll be in touch soon.",
} as const;

// =============================================================================
// FEATURE HIGHLIGHTS
// =============================================================================

export const FEATURE_HIGHLIGHTS = {
  LOGIN_PAGE: [
    { icon: "🌿", title: "500+", subtitle: "Natural Ingredients" },
    { icon: "🔬", title: "ISO", subtitle: "Certified Quality" },
    { icon: "🚚", title: "72hrs", subtitle: "Sample Dispatch" },
    { icon: "🌍", title: "Global", subtitle: "Sourcing Network" },
  ],
  HOME_PAGE: [
    { label: "ISO | GMP", value: "Certification-ready" },
    { label: "72 hrs", value: "Sample dispatch" },
    { label: "Global", value: "Sourcing network" },
    { label: "Formulator", value: "Technical support" },
  ],
  ABOUT_PAGE: [
    { label: "ISO Certified", value: "Ready" },
    { label: "GMP", value: "Aligned" },
    { label: "FSSAI", value: "Compliance" },
    { label: "MSDS / COA", value: "Available" },
  ],
} as const;

// =============================================================================
// BUSINESS INFO / TARGET CUSTOMERS
// =============================================================================

export const BUSINESS_INFO = {
  TARGET_CUSTOMERS:
    "Cosmetic brands, contract manufacturers, R&D labs, sourcing teams.",
  SUPPLY_FOCUS: "Essential oils, fixed oils, extracts, hydrosols.",
  INDUSTRIES: [
    "Personal Care",
    "Hair Care",
    "Skin Care",
    "Ayurvedic / Herbal",
    "Clean Beauty",
  ],
  WHY_CHOOSE_US: [
    "Quality & Purity tested to cosmetic-grade specifications",
    "Reliable sourcing with transparent documentation",
    "Formulation-aligned technical support",
    "Flexible MOQs, tailored packs, on-time dispatch",
  ],
} as const;
