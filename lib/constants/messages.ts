/**
 * Messages Constants
 * ==================
 * Contains all error and success messages.
 */

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
    INVALID_CREDENTIALS: "Invalid credentials. Please check your email and password.",
    SESSION_REQUIRED: "Please sign in to access this page",
    ACCESS_DENIED: "Access denied. There was an error during authentication. Please try again.",
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
    CredentialsSignin: "Invalid credentials. Please check your email and password.",
    SessionRequired: "Please sign in to access this page",
    AccessDenied: "Access denied. There was an error during authentication. Please try again.",
    Configuration: "Server configuration error. Please contact support.",
    Default: "An authentication error occurred",
  },

  // Validation errors
  VALIDATION: {
    INVALID_REQUEST_BODY: "Invalid request body",
    INVALID_QUERY_PARAMS: "Invalid query parameters",
    INVALID_REQUEST: "Invalid request",
    VALIDATION_FAILED: "Validation failed",
    COMPANY_NAME_MAX_LENGTH: "Company name cannot exceed 100 characters",
    EMAIL_MAX_LENGTH: "Email cannot exceed 100 characters",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PHONE_MAX_LENGTH: "Phone number cannot exceed 15 characters",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    NAME_REQUIRED: "Name is required",
    NAME_MIN_LENGTH: "Name must be at least 2 characters",
    NAME_MAX_LENGTH: "Name cannot exceed 100 characters",
    PASSWORDS_NO_MATCH: "Passwords do not match",
    MESSAGE_MAX_LENGTH: "Message cannot exceed 500 characters",
    INVALID_EMAIL: "Invalid email address",
    TOKEN_REQUIRED: "Token is required",
    SECURITY_VERIFICATION_REQUIRED: "Please complete the security verification",
  },

  // Resource errors
  RESOURCE: {
    NOT_FOUND: "Resource not found",
    ORDER_NOT_FOUND: "Order not found",
    PRODUCT_NOT_FOUND: "Product not found",
    COLLECTION_NOT_FOUND: "Collection not found",
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
    NOT_CONFIGURED: "Turnstile site key is not configured in environment variables",
    VERIFICATION_FAILED: "Verification failed",
    SERVER_CONFIG_ERROR: "Server configuration error",
    SECURITY_VERIFICATION_FAILED: "Security verification failed. Please try again.",
  },

  // Form/Contact errors
  FORM: {
    SEND_FAILED: "Failed to send your message. Please try again or contact us directly.",
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
