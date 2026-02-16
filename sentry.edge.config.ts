/**
 * Sentry Edge Configuration
 * =========================
 * Configuration for edge runtime error tracking.
 * This runs on Vercel Edge Functions / Middleware.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN (Data Source Name)
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Enable tracing for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Debug mode
  debug: process.env.NODE_ENV === "development",

  // Don't send errors in development unless explicitly enabled
  enabled: process.env.NODE_ENV !== "development" || process.env.SENTRY_ENABLED === "true",

  // Configure beforeSend to scrub sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }

    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    "NetworkError",
    "Network request failed",
    "AbortError",
    "The user aborted a request",
  ],

  // Set tags
  initialScope: {
    tags: {
      runtime: "edge",
    },
  },
});
