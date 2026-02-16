/**
 * Sentry Edge Configuration
 * Runs on Vercel Edge Functions / Middleware.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  enabled: process.env.NODE_ENV !== "development" || process.env.SENTRY_ENABLED === "true",

  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }
    return event;
  },

  ignoreErrors: ["AbortError"],

  initialScope: { tags: { runtime: "edge" } },
});
