/**
 * API Route Helpers with Sentry Integration
 * Wraps API handlers with tracing, user context, and error handling.
 */

import { auth } from "@/lib/auth";
import { addBreadcrumb, setContext, setSentryUser } from "@/lib/sentry";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "./errorHandler";

/** Flat key-value pairs safe for Sentry span attributes. */
function extractSpanAttributes(request: NextRequest): Record<string, string> {
  const url = new URL(request.url);
  return {
    "http.method": request.method,
    "http.url": url.pathname,
    "http.query": url.search,
    "http.user_agent": request.headers.get("user-agent") ?? "",
  };
}

/** Richer context object attached to the Sentry scope (not span). */
function extractRequestContext(request: NextRequest) {
  const url = new URL(request.url);
  return {
    method: request.method,
    url: url.pathname,
    query: Object.fromEntries(url.searchParams),
    userAgent: request.headers.get("user-agent"),
    contentType: request.headers.get("content-type"),
    referer: request.headers.get("referer"),
  };
}

/**
 * Wrap an API route handler with Sentry tracing & error handling.
 *
 * ```ts
 * export const GET = withSentryAPI(async (request) => {
 *   return NextResponse.json({ data: "..." });
 * }, { operationName: "GET /api/products" });
 * ```
 */
export function withSentryAPI<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  options?: {
    operationName?: string;
    includeSession?: boolean;
  },
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const operationName =
      options?.operationName ?? `${request.method} ${new URL(request.url).pathname}`;

    return Sentry.withScope(async (scope) => {
      try {
        // Breadcrumb + scope context
        addBreadcrumb(`API: ${operationName}`, "http", "info", extractRequestContext(request));
        setContext("request", extractRequestContext(request));

        // Attach user when available
        if (options?.includeSession !== false) {
          try {
            const session = await auth();
            if (session?.user) {
              setSentryUser(session.user);
              setContext("user", {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
              });
            }
          } catch {
            addBreadcrumb("Session retrieval failed", "auth", "warning");
          }
        }

        // Execute with a Sentry span for tracing
        const response = await Sentry.startSpan(
          {
            name: operationName,
            op: "http.server",
            attributes: extractSpanAttributes(request),
          },
          async () => {
            const result = await handler(request, ...args);
            scope.setTag("http.status_code", String(result.status));
            return result;
          },
        );

        return response;
      } catch (error) {
        scope.setTag("error", "true");
        addBreadcrumb(`API Error: ${operationName}`, "http", "error", {
          error: String(error),
        });
        return handleError(error);
      }
    }) as Promise<NextResponse>;
  };
}

/** Measure an async operation as a Sentry span. */
export async function measurePerformance<T>(name: string, operation: () => Promise<T>): Promise<T> {
  return Sentry.startSpan({ name, op: "function" }, () => operation());
}
