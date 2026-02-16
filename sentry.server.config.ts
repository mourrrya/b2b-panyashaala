/**
 * Sentry Server Configuration
 * ===========================
 * Configuration for server-side error tracking and performance monitoring.
 * This runs in the Node.js runtime.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN (Data Source Name) - Get this from your Sentry project settings
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment (production, staging, development)
  environment: process.env.NODE_ENV || "development",

  // Enable tracing for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Debug mode (useful for development)
  debug: process.env.NODE_ENV === "development",

  // Enable profiling for performance insights
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Integration configurations
  integrations: [
    // Enable HTTP integration for tracing outgoing HTTP requests
    Sentry.httpIntegration({
      tracing: true,
    }),
    // Enable Prisma integration for database query tracing
    Sentry.prismaIntegration(),
  ],

  // Don't send errors in development unless explicitly enabled
  enabled: process.env.NODE_ENV !== "development" || process.env.SENTRY_ENABLED === "true",

  // Automatically capture console errors
  autoSessionTracking: true,

  // Configure beforeSend to scrub sensitive data
  beforeSend(event, hint) {
    // Remove sensitive data from event
    if (event.request) {
      // Remove authorization headers
      if (event.request.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
        delete event.request.headers["x-api-key"];
      }

      // Remove sensitive query parameters
      if (event.request.query_string) {
        const sensitiveParams = ["token", "password", "secret", "api_key", "apikey"];
        sensitiveParams.forEach((param) => {
          if (event.request?.query_string?.includes(param)) {
            event.request.query_string = event.request.query_string.replace(
              new RegExp(`${param}=[^&]*`, "gi"),
              `${param}=[REDACTED]`,
            );
          }
        });
      }
    }

    // Remove sensitive data from error messages
    if (event.message) {
      const sensitivePatterns = [
        /password["\s:=]+[^\s&,}]+/gi,
        /token["\s:=]+[^\s&,}]+/gi,
        /api[_-]?key["\s:=]+[^\s&,}]+/gi,
        /secret["\s:=]+[^\s&,}]+/gi,
      ];

      sensitivePatterns.forEach((pattern) => {
        event.message = event.message!.replace(pattern, "[REDACTED]");
      });
    }

    return event;
  },

  // Ignore certain errors that are not actionable
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "chrome-extension",
    "moz-extension",
    // Random network errors
    "NetworkError",
    "Network request failed",
    // Cancelled requests
    "AbortError",
    "The user aborted a request",
    // Common user-caused errors
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  // Set tags for better error categorization
  initialScope: {
    tags: {
      runtime: "server",
    },
  },
});
