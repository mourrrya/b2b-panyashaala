/**
 * HTTP Status Codes Constants
 * ===========================
 * Contains HTTP status codes used across the application.
 */

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export const HTTP_STATUS: { [key: string]: number } = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
