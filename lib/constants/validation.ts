/**
 * Validation Constants
 * ====================
 * Centralized validation rules and regex patterns.
 */

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION_RULES = {
  /** Name validation */
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },

  /** Email validation */
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },

  /** Password validation */
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },

  /** Company name validation */
  COMPANY: {
    MAX_LENGTH: 200,
  },

  /** Message validation */
  MESSAGE: {
    MAX_LENGTH: 2000,
  },
} as const;

// =============================================================================
// FILE UPLOAD RULES
// =============================================================================

export const FILE_UPLOAD_RULES = {
  /** Avatar image upload */
  AVATAR: {
    ALLOWED_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    ALLOWED_EXTENSIONS: ".png,.jpg,.jpeg,.webp",
    MAX_SIZE_BYTES: 200 * 1024, // 200KB
    MAX_SIZE_KB: 200,
  },

  /** General image upload */
  IMAGE: {
    ALLOWED_TYPES: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
    ],
    MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    MAX_SIZE_MB: 5,
  },
} as const;

// =============================================================================
// VALIDATION MESSAGES (used by Zod schemas)
// =============================================================================

export const VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: "Name is required",
    MIN: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`,
    MAX: `Name must be at most ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`,
  },
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Invalid email address",
    PLEASE_ENTER_VALID: "Please enter a valid email address",
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    MIN: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    NO_MATCH: "Passwords do not match",
  },
  TURNSTILE: {
    REQUIRED: "Please complete the security verification",
  },
} as const;

// =============================================================================
// ZOD SCHEMA HELPERS
// =============================================================================

/**
 * Create consistent validation error messages for forms
 */
export function getFormValidationMessage(
  field: "name" | "email" | "password" | "turnstile",
  type: "required" | "min" | "max" | "invalid" | "no_match",
): string {
  const messages: Record<string, Record<string, string>> = {
    name: {
      required: VALIDATION_MESSAGES.NAME.REQUIRED,
      min: VALIDATION_MESSAGES.NAME.MIN,
      max: VALIDATION_MESSAGES.NAME.MAX,
    },
    email: {
      required: VALIDATION_MESSAGES.EMAIL.REQUIRED,
      invalid: VALIDATION_MESSAGES.EMAIL.INVALID,
    },
    password: {
      required: VALIDATION_MESSAGES.PASSWORD.REQUIRED,
      min: VALIDATION_MESSAGES.PASSWORD.MIN,
      no_match: VALIDATION_MESSAGES.PASSWORD.NO_MATCH,
    },
    turnstile: {
      required: VALIDATION_MESSAGES.TURNSTILE.REQUIRED,
    },
  };

  return messages[field]?.[type] || "Invalid value";
}
