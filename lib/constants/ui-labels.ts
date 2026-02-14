/**
 * UI Labels & Text Constants
 * ==========================
 * Contains all user-facing labels, buttons, and text content.
 */

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
    PHONE: "Phone (Optional)",
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
    PHONE: "Your phone number (Optional)",
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
    RESPONSE_MESSAGE: "We typically respond to inquiries within 24 business hours.",
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
    CTA_SUBTITLE: "Our sourcing specialists are ready to help you create the perfect formulation",
    CALL_LABEL: "Call",
    SEND_ENQUIRY: "Send Enquiry",
    NO_RESULTS: "No applications found matching your search.",
    CLEAR_SEARCH: "Clear search",
    KEY_INGREDIENTS: "Key Ingredients:",
    SEARCH_ALL_INGREDIENTS: "Search - All Ingredients",
    CLICK_TO_VIEW: "Click to view ingredients",
    LOADING: "Loading collections...",
    ERROR_LOADING: "Failed to load collections. Please try again.",
    RETRY: "Retry",
    VIEW_PRODUCTS: "View Products",
    PRODUCTS_COUNT: "products",
    BACK_TO_COLLECTIONS: "Back to Collections",
    COLLECTION_NOT_FOUND: "Collection not found",
    COLLECTION_NOT_FOUND_SUBTITLE: "The collection you are looking for does not exist.",
    NO_PRODUCTS: "No products in this collection yet.",
    NO_PRODUCTS_SUBTITLE: "Check back later for new additions.",
    BROWSE_ALL: "Browse All Products",
    SHOWING_PRODUCTS: "Showing",
    OF_PRODUCTS: "of",
    ALL_PRODUCTS_SHOWN: "Showing all",
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
