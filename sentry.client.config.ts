/**
 * Sentry Client Configuration
 * Runs in the browser. Captures client-side errors, performance, and replays.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",

  // Performance — lower on client to reduce overhead
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    Sentry.browserTracingIntegration(),
  ],

  enabled:
    process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",

  beforeSend(event) {
    // Scrub sensitive form fields
    if (event.request?.data && typeof event.request.data === "object") {
      const data = event.request.data as Record<string, unknown>;
      for (const key of ["password", "token", "secret", "apiKey", "api_key"]) {
        if (key in data) data[key] = "[REDACTED]";
      }
    }
    return event;
  },

  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    /chrome-extension|moz-extension/,
    // Network — already tracked via Axios interceptor
    "NetworkError",
    "Failed to fetch",
    "AbortError",
    // Benign browser noise
    "ResizeObserver loop",
  ],

  initialScope: { tags: { runtime: "browser" } },
});
