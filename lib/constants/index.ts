/**
 * Centralized Constants File
 * ==========================
 * This file contains all hard-coded strings, messages, and configuration values
 * used throughout the application. Organized by category for easy maintenance.
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
// NAVIGATION
// =============================================================================

export const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/applications", label: "Applications" },
  { href: "/quality", label: "Quality" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { href: "/products?category=essential-oil", label: "Essential Oils" },
    { href: "/products?category=fixed-oil", label: "Carrier Oils" },
    { href: "/products?category=extract", label: "Extracts" },
    { href: "/products?category=hydrosol", label: "Hydrosols" },
  ],
  resources: [
    { href: "/about", label: "About Us" },
    { href: "/quality", label: "Quality" },
    { href: "/applications", label: "Applications" },
    { href: "/sitemap.xml", label: "Sitemap", external: true },
  ],
} as const;

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export const PRODUCT_CATEGORIES = [
  { value: "essential-oil", label: "Essential Oils" },
  { value: "fixed-oil", label: "Fixed/Carrier Oils" },
  { value: "extract", label: "Plant Extracts" },
  { value: "hydrosol", label: "Hydrosols" },
] as const;

export const PRODUCT_CATEGORY_DESCRIPTIONS = {
  "essential-oil":
    "Therapeutic-grade oils for active performance and signature fragrance.",
  "fixed-oil":
    "Stable oils delivering emolliency, conditioning, and skin barrier support.",
  extract: "Dry, water, and oil-soluble actives for targeted performance.",
  hydrosol:
    "Gentle waters and distillates for toners, mists, and rinse-off bases.",
} as const;

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTH_CONFIG = {
  /** Session duration in seconds (30 days) */
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,

  /** Auth pages routes */
  PAGES: {
    SIGN_IN: "/login",
    ERROR: "/login",
  },

  /** Protected routes that require authentication */
  PROTECTED_ROUTES: ["/profile"],

  /** Auth routes that redirect if already logged in */
  AUTH_ROUTES: ["/login"],

  /** Password requirements */
  PASSWORD_MIN_LENGTH: 8,

  /** Avatar upload constraints */
  AVATAR: {
    ALLOWED_FILE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    MAX_FILE_SIZE: 200 * 1024, // 200KB in bytes
    ACCEPTED_EXTENSIONS: ".png,.jpg,.jpeg,.webp",
  },
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  /** Base URL for API requests */
  BASE_URL: "/api",

  /** API endpoints */
  ENDPOINTS: {
    PROFILE: "/api/profile",
    PRODUCTS: "/api/products",
    ORDERS: "/api/orders",
    VERIFY_TURNSTILE: "/api/verify-turnstile",
  },

  /** Robots disallowed paths */
  ROBOTS_DISALLOW: ["/api/", "/admin/", "/_private/"],
} as const;

// =============================================================================
// TURNSTILE (CLOUDFLARE) CONFIGURATION
// =============================================================================

export const TURNSTILE_CONFIG = {
  VERIFY_URL: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  TEST_TOKEN_PREFIX: "test-token-",
  PLACEHOLDER_KEY: "your_turnstile_site_key",
  PLACEHOLDER_SECRET: "your_turnstile_secret_key",
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  // General errors
  GENERIC: "Something went wrong",
  NETWORK: "Network error",
  UNKNOWN: "Unknown error",
  INTERNAL_SERVER: "Internal server error",
  UNEXPECTED: "An unexpected error occurred",

  // Authentication errors
  AUTH: {
    UNAUTHORIZED: "Unauthorized",
    AUTHENTICATION_ERROR: "Authentication error",
    AUTHENTICATION_FAILED: "Authentication failed",
    INVALID_CREDENTIALS:
      "Invalid credentials. Please check your email and password.",
    SESSION_REQUIRED: "Please sign in to access this page",
    ACCESS_DENIED:
      "Access denied. There was an error during authentication. Please try again.",
    CONFIGURATION_ERROR: "Server configuration error. Please contact support.",
    DEFAULT: "An authentication error occurred",
  },

  // OAuth errors
  OAUTH: {
    OAuthSignin: "Error starting the OAuth sign in process",
    OAuthCallback: "Error handling the OAuth callback",
    OAuthCreateAccount: "Error creating OAuth account",
    EmailCreateAccount: "Error creating email account",
    Callback: "Error in the callback handler",
    OAuthAccountNotLinked:
      "This email is already associated with another account. Please sign in with your original method.",
    EmailSignin: "Error sending the email verification link",
    CredentialsSignin:
      "Invalid credentials. Please check your email and password.",
    SessionRequired: "Please sign in to access this page",
    AccessDenied:
      "Access denied. There was an error during authentication. Please try again.",
    Configuration: "Server configuration error. Please contact support.",
    Default: "An authentication error occurred",
  },

  // Validation errors
  VALIDATION: {
    INVALID_REQUEST_BODY: "Invalid request body",
    INVALID_QUERY_PARAMS: "Invalid query parameters",
    INVALID_REQUEST: "Invalid request",
    VALIDATION_FAILED: "Validation failed",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    NAME_REQUIRED: "Name is required",
    NAME_MIN_LENGTH: "Name must be at least 2 characters",
    PASSWORDS_NO_MATCH: "Passwords do not match",
    INVALID_EMAIL: "Invalid email address",
    TOKEN_REQUIRED: "Token is required",
    SECURITY_VERIFICATION_REQUIRED: "Please complete the security verification",
  },

  // Resource errors
  RESOURCE: {
    NOT_FOUND: "Resource not found",
    ORDER_NOT_FOUND: "Order not found",
    PRODUCT_NOT_FOUND: "Product not found",
    INVALID_PRODUCT_ID: "Invalid Product ID",
    FORBIDDEN: "Forbidden",
    ALREADY_EXISTS: "Resource already exists",
  },

  // Turnstile/Security errors
  TURNSTILE: {
    NETWORK_ERROR: "Network error. Please check your internet connection.",
    PARSE_ERROR: "Configuration error. Please contact support.",
    CONFIG_ERROR: "Invalid configuration. Please contact support.",
    GENERIC_CLIENT_ERROR: "Verification failed. Please try again.",
    DEFAULT: "Security verification failed. Please try again.",
    EXPIRED: "Security verification expired. Please verify again.",
    TIMEOUT: "Verification timed out. Please try again.",
    INIT_FAILED: "Failed to initialize security verification",
    LOAD_FAILED: "Failed to load Turnstile verification system",
    NOT_CONFIGURED:
      "Turnstile site key is not configured in environment variables",
    VERIFICATION_FAILED: "Verification failed",
    SERVER_CONFIG_ERROR: "Server configuration error",
    SECURITY_VERIFICATION_FAILED:
      "Security verification failed. Please try again.",
  },

  // Form/Contact errors
  FORM: {
    SEND_FAILED:
      "Failed to send your message. Please try again or contact us directly.",
    UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  },

  // File upload errors
  FILE: {
    INVALID_TYPE: "Invalid file type. Allowed types: PNG, JPG, JPEG, WebP",
    SIZE_EXCEEDED: "File size exceeds 200KB limit.",
    UPLOAD_FAILED: "Failed to upload avatar",
  },

  // Product errors
  PRODUCT: {
    LOAD_FAILED: "Failed to load products",
    NOT_FOUND: "Product not found",
    FETCH_FAILED: "Failed to fetch product",
  },

  // Profile errors
  PROFILE: {
    UPDATE_FAILED: "Failed to update profile",
    FETCH_FAILED: "Failed to fetch profile",
  },
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

export const SUCCESS_MESSAGES = {
  FORM: {
    SUBMITTED: "✓ Thank you! We'll be in touch soon.",
    PROFILE_UPDATED: "Profile picture updated successfully!",
  },
  AUTH: {
    SIGNED_OUT: "Successfully signed out",
  },
} as const;

// =============================================================================
// UI LABELS & TEXT
// =============================================================================

export const UI_LABELS = {
  // Navigation & Actions
  ACTIONS: {
    VIEW_PRODUCTS: "View Product Range",
    SEND_ENQUIRY: "Send Enquiry",
    EXPLORE_PRODUCTS: "Explore Full Product Range →",
    BROWSE_PRODUCTS: "Browse Products",
    ADD_TO_ENQUIRY: "Add to Enquiry",
    ADDED_TO_ENQUIRY: "Added to Enquiry",
    SEND_MESSAGE: "Send Message",
    SENDING: "Sending...",
    SIGN_IN: "Sign In",
    SIGN_UP: "Create Account",
    SIGNING_IN: "Signing In...",
    CREATING_ACCOUNT: "Creating Account...",
    TRY_AGAIN: "Try again",
    TALK_TO_TEAM: "Talk to our sourcing team →",
  },

  // Page headers
  HEADERS: {
    HOME_TAGLINE: "Nature-powered actives for modern cosmetic formulations",
    HOME_TITLE: "Natural Ingredients for Next-Generation Cosmetics",
    ABOUT_TITLE: "Professionally set-up supplier for cosmetic innovators",
    CONTACT_TITLE: "Contact Our Sourcing Team",
    PRODUCTS_TITLE: "Product Catalog | Natural Cosmetic Ingredients",
    QUALITY_TITLE: "Quality-first supply with transparent documentation",
    APPLICATIONS_TITLE: "Industries & Applications",
    ENQUIRY_SUMMARY: "Enquiry Summary",
    SEND_MESSAGE: "Send us a message",
    GET_IN_TOUCH: "Get in Touch",
  },

  // Auth page
  AUTH: {
    WELCOME_BACK: "Welcome Back",
    CREATE_ACCOUNT: "Create Your Account",
    SIGN_IN_SUBTITLE: "Sign in to continue to your account",
    SIGN_UP_SUBTITLE: "Join us to explore premium ingredients",
    ALREADY_HAVE_ACCOUNT: "Already have an account?",
    DONT_HAVE_ACCOUNT: "Don't have an account?",
    CONTINUE_WITH_GOOGLE: "Continue with Google",
    OR_DIVIDER: "or continue with email",
  },

  // Profile page
  PROFILE: {
    MEMBER_SINCE: "Member Since",
    WELCOME: "Welcome",
    ORDERS: "Orders",
    PROFILE_ALT: "Profile",
    LOADING: "Loading profile...",
    PERSONAL_INFO: "Personal Information",
    PERSONAL_INFO_SUBTITLE: "Your personal details and contact information",
    BUSINESS_INFO: "Business Information",
    BUSINESS_INFO_SUBTITLE: "Your business details and tax information",
    ADDRESS_INFO: "Saved Addresses",
    ADDRESS_INFO_SUBTITLE: "Your shipping and billing addresses",
    EDIT: "Edit",
    SAVE: "Save",
    CANCEL: "Cancel",
    SAVING: "Saving...",
    NOT_PROVIDED: "Not provided",
    FULL_NAME: "Full Name",
    EMAIL_ADDRESS: "Email Address",
    PHONE_NUMBER: "Phone Number",
    ACCOUNT_TYPE: "Account Type",
    COMPANY_NAME: "Company Name",
    GST_IN: "GST IN",
    WEBSITE: "Website",
    BUSINESS_TYPE: "Business Type",
    ADDRESS_LINE_1: "Address Line 1",
    ADDRESS_LINE_2: "Address Line 2",
    CITY: "City",
    STATE: "State",
    POSTAL_CODE: "Postal Code",
    COUNTRY: "Country",
    DEFAULT: "Default",
    NO_ADDRESSES_TITLE: "No addresses saved yet",
    NO_ADDRESSES_SUBTITLE: "You haven't added any addresses to your profile",
    SHIPPING_ADDRESS: "Shipping Address",
    BILLING_ADDRESS: "Billing Address",
    SHIPPING_ADDRESS_DESC:
      "The address where your orders will be delivered. You can add multiple shipping addresses for convenience.",
    BILLING_ADDRESS_DESC:
      "The address that appears on invoices and payment records. This is often your business registered address.",
    UPDATE_SUCCESS: "Profile picture updated successfully",
    UPDATE_FAILED: "Failed to update profile picture",
    FILE_READ_FAILED: "Failed to read file",
  },

  // Orders page
  ORDERS: {
    MY_ORDERS: "My Orders",
    MY_ORDERS_SUBTITLE: "View and manage your order history",
    TOTAL: "Total",
    INVOICE: "Invoice",
    DOWNLOAD_INVOICE: "Download Invoice",
    DOWNLOAD_COA: "Download COA",
    ITEMS: "item",
    ITEMS_PLURAL: "items",
    NO_ORDERS_TITLE: "No Orders Yet",
    NO_ORDERS_SUBTITLE:
      "You haven't placed any orders yet. Browse our products and contact us for your first order today!",
    BROWSE_PRODUCTS: "Browse Products",
    FETCH_ERROR: "Failed to fetch orders",
    TRY_AGAIN: "Try Again",
    ORDER: "order",
    ORDERS_PLURAL: "orders",
    BACK_TO_ORDERS: "Back to Orders",
    ERROR_LOADING_ORDER: "Error Loading Order",
    ORDER_NOT_FOUND: "Order not found",
    ORDER_ITEMS: "Order Items",
    ORDER_SUMMARY: "Order Summary",
    ORDER_NOTES: "Order Notes",
    SUBTOTAL: "Subtotal",
    TAX: "Tax",
    SHIPPING: "Shipping",
    DISCOUNT: "Discount",
    PAYMENT_METHOD: "Payment Method",
    BATCH_NO: "Batch No.",
    HSN_CODE: "HSN Code",
    NET_CONTENT: "Net Content",
    GST_SLAB: "GST Slab",
    MFG_DATE: "Mfg",
    EXP_DATE: "Exp",
    UNIT_PRICE: "Unit Price",
    QTY: "Qty",
    NOT_PROVIDED: "Not provided",
    // Order status labels
    STATUS: {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    },
    // Payment status labels
    PAYMENT_STATUS: {
      PENDING: "Payment Pending",
      PAID: "Paid",
      FAILED: "Payment Failed",
      REFUNDED: "Refunded",
    },
  },

  // Navigation/Header labels
  NAV: {
    ACCOUNT_MENU: "Account menu",
    LOGIN_TITLE: "Login to your account",
    LOGIN_BUTTON: "Login",
    MY_PROFILE: "My Profile",
    MY_ORDERS: "My Orders",
    SIGN_OUT: "Sign Out",
    ACCOUNT: "Account",
    USER_AVATAR_ALT: "User avatar",
    // Aria labels
    TOGGLE_MENU: "Toggle navigation menu",
    MAIN_NAVIGATION: "Main navigation",
    MOBILE_NAVIGATION: "Mobile navigation",
    OPEN_BASKET: "Open enquiry basket drawer",
    FOLLOW_TWITTER: "Follow us on Twitter",
    FOLLOW_LINKEDIN: "Follow us on LinkedIn",
  },

  // Form labels
  FORM: {
    NAME: "Name *",
    FULL_NAME: "Full Name",
    EMAIL: "Email *",
    EMAIL_ADDRESS: "Email Address",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
    COMPANY: "Company (Optional)",
    MESSAGE: "Message (Optional)",
    PASSWORD_HELP: "Must be at least 8 characters",
  },

  // Placeholders
  PLACEHOLDERS: {
    NAME: "Your name",
    FULL_NAME: "John Doe",
    EMAIL: "your@email.com",
    EMAIL_LOGIN: "you@company.com",
    COMPANY: "Your company (Optional)",
    MESSAGE: "Any specific requirements or questions? (Optional)",
    PASSWORD: "••••••••",
    SEARCH_PRODUCTS: "Search by product name, INCI, or application...",
    SEARCH_APPLICATIONS: "Search applications or ingredients...",
  },

  // Basket/Cart
  BASKET: {
    EMPTY_TITLE: "Your enquiry basket is empty",
    EMPTY_SUBTITLE: "Add products to get started with your enquiry",
    PRODUCT_SELECTED: "product selected",
    PRODUCTS_SELECTED: "products selected",
    NO_PRODUCTS: "No products added yet",
    BROWSE_PRODUCTS: "Browse our products to add items for enquiry",
    CLEAR_ALL: "Clear All",
    REMOVE_FROM_ENQUIRY: "Remove from enquiry",
    ENQUIRY: "Enquiry",
    ENQUIRY_BASKET: "Enquiry Basket",
    VIEW_BASKET_TITLE: "View enquiry basket",
    ITEMS_IN_BASKET: "items in enquiry basket",
  },

  // Contact page labels
  CONTACT: {
    EMAIL: "Email",
    PHONE: "Phone",
    RESPONSE_TIME: "Response Time",
    RESPONSE_MESSAGE:
      "We typically respond to inquiries within 24 business hours.",
  },

  // Breadcrumb labels
  BREADCRUMBS: {
    HOME: "Home",
    PRODUCTS: "Products",
    ABOUT: "About",
    CONTACT: "Contact",
    QUALITY: "Quality",
    APPLICATIONS: "Applications",
    ORDERS: "Orders",
    PROFILE: "Profile",
  },

  // Sections
  SECTIONS: {
    ABOUT: "About",
    ABOUT_US: "About Us",
    PRODUCTS: "Products",
    RESOURCES: "Resources",
    CONTACT: "Contact",
    PRODUCT_PORTFOLIO: "Product Portfolio",
    WHY_CHOOSE_US: "Why Choose Us",
    INDUSTRIES_AND_APPLICATIONS: "Industries & Applications",
    OUR_APPROACH: "Our Approach",
    QUALITY_SOURCING: "Quality & Sourcing",
    FAQ: "FAQ",
    APPLICATIONS: "Applications",
    TARGET_CUSTOMERS: "Target Customers",
    SUPPLY_FOCUS: "Supply Focus",
  },

  // Products page
  PRODUCTS_PAGE: {
    NO_PRODUCTS_FOUND: "No products found matching your search.",
    CLEAR_FILTERS: "Clear filters",
  },

  // Applications page
  APPLICATIONS: {
    TITLE: "Premium ingredient solutions for your formulations",
    SUBTITLE:
      "Explore our curated ingredient combinations designed for specific applications and product categories",
    CTA_TITLE: "Need personalized ingredient recommendations?",
    CTA_SUBTITLE:
      "Our sourcing specialists are ready to help you create the perfect formulation",
    CALL_LABEL: "Call",
    SEND_ENQUIRY: "Send Enquiry",
    NO_RESULTS: "No applications found matching your search.",
    CLEAR_SEARCH: "Clear search",
    KEY_INGREDIENTS: "Key Ingredients:",
    SEARCH_ALL_INGREDIENTS: "Search - All Ingredients",
    CLICK_TO_VIEW: "Click to view ingredients",
  },

  // Trust badges
  TRUST: {
    SSL: "256-bit SSL",
    SECURE_AUTH: "Secure Auth",
    PREMIUM_B2B: "Premium B2B Ingredients",
  },

  // Turnstile verification UI
  TURNSTILE: {
    ERROR_TITLE: "Security Verification Error",
    DEV_MODE_TITLE: "🔧 Development Mode - Mock Verification",
    DEV_MODE_DISABLED: "Turnstile verification is disabled in development.",
    DEV_MODE_CONFIG: "Configure NEXT_PUBLIC_TURNSTILE_SITE_KEY for production.",
    TEST_MODE_BYPASSED: "Test mode enabled - verification will be bypassed",
    MOCK_COMPLETE: "✓ Verification Complete (Mock)",
    LOADING: "Loading verification...",
  },
} as const;

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

// =============================================================================
// APPROACH STEPS (About Page)
// =============================================================================

export const APPROACH_STEPS = [
  {
    title: "Sourcing",
    description:
      "Partnering with trusted growers, distillers, and extraction houses.",
  },
  {
    title: "Quality & Testing",
    description:
      "GC/MS, microbiology, and stability checks aligned with cosmetic specs.",
  },
  {
    title: "Customization & Support",
    description:
      "Documentation packets, format customization, and formulation insights.",
  },
  {
    title: "On-time Supply",
    description:
      "Optimized logistics and inventory planning for global shipments.",
  },
] as const;

// =============================================================================
// FAQ DATA (Quality Page)
// =============================================================================

export const FAQ_DATA = [
  {
    question: "What testing standards do you follow?",
    answer:
      "We conduct GC/MS analysis, microbiology tests (aerobic plate count, pathogens), stability checks, and organoleptic evaluations aligned with ISO 9001 and GMP standards for cosmetic-grade ingredients.",
  },
  {
    question: "Do you provide documentation for compliance?",
    answer:
      "Yes, we supply Certificate of Analysis (COA), MSDS/SDS, INCI declarations, allergen data, IFRA statements, and technical dossiers per shipment.",
  },
  {
    question: "What are your MOQ and lead times?",
    answer:
      "Minimum order quantities vary by product but typically range from 5kg to 25kg. We dispatch samples within 72 hours and bulk orders within 2-4 weeks.",
  },
  {
    question: "Do you support customization?",
    answer:
      "Yes, we offer format customization (pH adjustment, viscosity modification), private labeling, and custom blends tailored to your formulation requirements.",
  },
] as const;

// =============================================================================
// QUALITY PAGE FEATURES
// =============================================================================

export const QUALITY_FEATURES = [
  {
    title: "Quality First",
    description:
      "Each lot undergoes organoleptic checks, purity analysis, microbiology, and stability review tailored to cosmetic-grade expectations.",
  },
  {
    title: "Sourcing & Traceability",
    description:
      "Direct programs with growers and extraction partners ensure farm-level traceability and sustainable harvest practices.",
  },
  {
    title: "Compliance",
    description:
      "COA, MSDS/SDS, IFRA statements, allergen data, and technical dossiers available per shipment.",
  },
] as const;

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

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
