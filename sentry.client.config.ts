/**
 * Sentry Client Configuration
 * ===========================
 * Configuration for client-side error tracking and performance monitoring.
 * This runs in the browser.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN (Data Source Name) - Must use NEXT_PUBLIC_ prefix for client-side
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment (production, staging, development)
  environment: process.env.NODE_ENV || "development",

  // Enable tracing for performance monitoring (lower sample rate on client)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Replay session sampling
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Debug mode (useful for development)
  debug: process.env.NODE_ENV === "development",

  // Integration configurations
  integrations: [
    // Capture user interactions for replay
    Sentry.replayIntegration({
      maskAllText: true, // Mask all text for privacy
      blockAllMedia: true, // Block all media for privacy
    }),
    // Browser tracing for performance
    Sentry.browserTracingIntegration({
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/.*\.vercel\.app/,
        /^\//,
      ],
    }),
  ],

  // Don't send errors in development unless explicitly enabled
  enabled: process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",

  // Configure beforeSend to scrub sensitive data
  beforeSend(event, hint) {
    // Remove sensitive data from forms
    if (event.request?.data) {
      const sensitiveFields = ["password", "token", "secret", "apiKey", "api_key"];
      if (typeof event.request.data === "object") {
        sensitiveFields.forEach((field) => {
          if (field in event.request.data) {
            event.request.data[field] = "[REDACTED]";
          }
        });
      }
    }

    // Remove sensitive cookies
    if (event.request?.cookies) {
      const sensitiveCookies = ["session", "token", "auth"];
      sensitiveCookies.forEach((cookie) => {
        if (event.request?.cookies && cookie in event.request.cookies) {
          event.request.cookies[cookie] = "[REDACTED]";
        }
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
    "Failed to fetch",
    // Cancelled requests
    "AbortError",
    "The user aborted a request",
    // Common user-caused errors
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Ad blockers
    "AdBlocker",
    "adsbygoogle",
  ],

  // Set tags for better error categorization
  initialScope: {
    tags: {
      runtime: "browser",
    },
  },
});
