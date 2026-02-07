/**
 * Site Configuration Constants
 * ============================
 * Contains site-wide configuration, contact info, and social media settings.
 */

// =============================================================================
// SITE CONFIGURATION
// =============================================================================

export const SITE_CONFIG = {
  /** Main site URL for production */
  URL: "https://aukra.co.in",

  /** Company/Brand name */
  NAME: "Aukra Chem Essentials LLP",

  /** Primary site description for SEO */
  DESCRIPTION:
    "Professional B2B supplier of natural cosmetic ingredients including essential oils, carrier oils, botanical extracts, and hydrosols for formulators and manufacturers.",

  /** Default Open Graph image path */
  DEFAULT_OG_IMAGE: "/og-image-default.jpg",

  /** Logo paths */
  LOGO: {
    TEXT: "/logo-text.svg",
    TEXT_SLOGAN: "/logo-text-slogan.svg",
    PLACEHOLDER: "/placeholder-logo.svg",
  },

  /** Default locale */
  LOCALE: "en_US",

  /** Currency */
  CURRENCY: "USD",
} as const;

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const CONTACT_INFO = {
  /** Primary phone number */
  PHONE: "+91 8076450898",
  PHONE_DISPLAY: "+91 80764 50898",

  /** Email addresses */
  EMAIL: {
    SUPPORT: "care@aukra.co.in",
  },

  /** Email recipient name */
  RECIPIENT_NAME: "Sai Enterprise",
} as const;

// =============================================================================
// SOCIAL MEDIA HANDLES
// =============================================================================

export const SOCIAL_HANDLES = {
  twitter: "cosmeticsupply",
  linkedin: "aukra-chemical-essentials",
  instagram: "aukra.co.in",
} as const;

export const SOCIAL_LINKS = {
  twitter: `https://twitter.com/${SOCIAL_HANDLES.twitter}`,
  linkedin: `https://linkedin.com/company/${SOCIAL_HANDLES.linkedin}`,
  instagram: `https://instagram.com/${SOCIAL_HANDLES.instagram}`,
} as const;

// =============================================================================
// VERIFICATION TOKENS (Replace with actual values in production)
// =============================================================================

export const VERIFICATION_TOKENS = {
  googleSiteVerification: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  bingMsvalidate: "YOUR_BING_VERIFICATION_TOKEN",
} as const;

// =============================================================================
// IMAGE UPLOAD CONFIGURATION
// =============================================================================

export const IMG_CONFIG = {
  AVATAR: {
    ALLOWED_FILE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    MAX_FILE_SIZE: 200 * 1024, // 200KB in bytes
    ACCEPTED_EXTENSIONS: ".png,.jpg,.jpeg,.webp",
  },
} as const;
