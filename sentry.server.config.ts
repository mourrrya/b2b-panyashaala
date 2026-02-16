/**
 * Sentry Server Configuration
 * Runs in the Node.js runtime. Captures server-side errors, DB queries, and HTTP calls.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  integrations: [Sentry.httpIntegration(), Sentry.prismaIntegration()],

  enabled: process.env.NODE_ENV !== "development" || process.env.SENTRY_ENABLED === "true",

  beforeSend(event) {
    // Strip auth-related headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }

    // Redact sensitive query params
    if (event.request?.query_string && typeof event.request.query_string === "string") {
      event.request.query_string = event.request.query_string.replace(
        /\b(token|password|secret|api_?key)=[^&]*/gi,
        "$1=[REDACTED]",
      );
    }

    // Redact sensitive values in error messages
    if (event.message) {
      event.message = event.message.replace(
        /(password|token|api[_-]?key|secret)["'\s:=]+[^\s&,}"']+/gi,
        "[REDACTED]",
      );
    }

    return event;
  },

  ignoreErrors: ["AbortError", "The user aborted a request"],

  initialScope: { tags: { runtime: "server" } },
});
