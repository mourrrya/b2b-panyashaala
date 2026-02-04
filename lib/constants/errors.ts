/**
 * Error Messages Constants
 * ========================
 * Centralized error messages for the application.
 * Import from @/lib/constants or @/lib/constants/errors
 */

// Re-export the main error messages from the index
export { ERROR_MESSAGES, HTTP_STATUS } from "./index";

/**
 * Helper function to decode OAuth error messages
 * @param error - The error code from the URL
 * @returns User-friendly error message
 */
export function decodeOAuthError(error: string): string {
  const errorMessages: Record<string, string> = {
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
  };

  return errorMessages[error] || errorMessages.Default;
}

/**
 * Get Turnstile error message from error code
 * @param errorCode - The Turnstile error code
 * @returns User-friendly error message
 */
export function getTurnstileErrorMessage(errorCode?: string): string {
  switch (errorCode) {
    case "network-error":
      return "Network error. Please check your internet connection.";
    case "parse-error":
      return "Configuration error. Please contact support.";
    case "config-error":
      return "Invalid configuration. Please contact support.";
    case "generic-client-error":
      return "Verification failed. Please try again.";
    default:
      return "Security verification failed. Please try again.";
  }
}
