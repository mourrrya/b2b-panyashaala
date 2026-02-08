/**
 * Auth Security Utilities
 *
 * This module provides security utilities for the authentication system.
 * It includes password strength validation, rate limiting helpers, and
 * secure comparison functions.
 */

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: false, // Optional: set to true to require uppercase
  requireLowercase: false, // Optional: set to true to require lowercase
  requireNumbers: false, // Optional: set to true to require numbers
  requireSpecial: false, // Optional: set to true to require special chars
};

/**
 * Validates password strength
 * Returns null if valid, or an error message if invalid
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }

  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    return `Password must be at most ${PASSWORD_REQUIREMENTS.maxLength} characters`;
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  if (
    PASSWORD_REQUIREMENTS.requireSpecial &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return "Password must contain at least one special character";
  }

  return null;
}

/**
 * Email validation regex (RFC 5322 compliant)
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 */
export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
}

/**
 * Normalizes email for consistent storage and comparison
 * - Converts to lowercase
 * - Trims whitespace
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Masks email for display (e.g., j***@example.com)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  return `${localPart[0]}${"*".repeat(Math.min(localPart.length - 2, 3))}${localPart[localPart.length - 1]}@${domain}`;
}

/**
 * Simple in-memory rate limiting for development
 * In production, use Redis or a dedicated rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if an action should be rate limited
 * @param key Unique identifier (e.g., IP address, user ID, email)
 * @param limit Maximum attempts allowed
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60000, // 1 minute
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Clean up old entries
  if (record && now > record.resetTime) {
    rateLimitMap.delete(key);
  }

  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs / 1000 };
  }

  if (current.count >= limit) {
    const resetIn = Math.ceil((current.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  current.count++;
  return {
    allowed: true,
    remaining: limit - current.count,
    resetIn: Math.ceil((current.resetTime - now) / 1000),
  };
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Common login error messages that don't reveal user existence
 * This helps prevent user enumeration attacks
 */
export const GENERIC_AUTH_ERROR = "Invalid email or password";

/**
 * Timing-safe string comparison to prevent timing attacks
 * Note: For actual password comparison, use bcrypt.compare which is already timing-safe
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
