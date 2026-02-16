/**
 * Next.js Instrumentation
 * Initializes Sentry for server & edge runtimes.
 * Exports onRequestError to capture RSC / middleware errors automatically.
 */

import { captureRequestError } from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Captures errors from Server Components, Server Actions, Route Handlers,
 * and Middleware. This is called by Next.js automatically.
 */
export const onRequestError = captureRequestError;
