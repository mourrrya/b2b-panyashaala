/**
 * API Route Helpers with Sentry Integration
 * ==========================================
 * Utilities to wrap API routes with tracing and error handling.
 */

import { addBreadcrumb, setContext, setSentryUser } from "@/lib/sentry";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "./errorHandler";

/**
 * Extract request context for Sentry
 */
function extractRequestContext(request: NextRequest) {
  const url = new URL(request.url);
  return {
    method: request.method,
    url: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: {
      "user-agent": request.headers.get("user-agent"),
      "content-type": request.headers.get("content-type"),
      referer: request.headers.get("referer"),
    },
  };
}

/**
 * Wrap an API route handler with Sentry tracing and error handling
 * 
 * Usage:
 * ```typescript
 * export const GET = withSentryAPI(
 *   async (request) => {
 *     // Your handler code
 *     return NextResponse.json({ data: "..." });
 *   },
 *   { operationName: "GET /api/products" }
 * );
 * ```
 */
export function withSentryAPI<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  options?: {
    operationName?: string;
    includeSession?: boolean;
  },
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const operationName = options?.operationName || `${request.method} ${new URL(request.url).pathname}`;

    // Start a transaction for this API call
    const transaction = Sentry.startTransaction({
      name: operationName,
      op: "http.server",
      data: extractRequestContext(request),
    });

    // Set the transaction on the scope
    Sentry.getCurrentScope().setSpan(transaction);

    try {
      // Add breadcrumb for the API call
      addBreadcrumb(
        `API Request: ${operationName}`,
        "http",
        "info",
        extractRequestContext(request),
      );

      // Set request context
      setContext("request", extractRequestContext(request));

      // Get user session if needed
      if (options?.includeSession !== false) {
        try {
          const session = await getServerSession();
          if (session?.user) {
            setSentryUser(session.user);
            setContext("user", {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            });
          }
        } catch (sessionError) {
          // Session retrieval failed, continue without it
          addBreadcrumb("Failed to retrieve session", "auth", "warning");
        }
      }

      // Execute the handler
      const response = await handler(request, ...args);

      // Set response status tag
      transaction.setTag("http.status_code", String(response.status));
      transaction.setStatus(response.status < 400 ? "ok" : "unknown_error");

      // Add breadcrumb for response
      addBreadcrumb(
        `API Response: ${operationName}`,
        "http",
        response.status < 400 ? "info" : "error",
        { status: response.status },
      );

      return response;
    } catch (error) {
      // Mark transaction as failed
      transaction.setStatus("internal_error");
      transaction.setTag("error", "true");

      // Add breadcrumb for error
      addBreadcrumb(
        `API Error: ${operationName}`,
        "http",
        "error",
        { error: String(error) },
      );

      // Handle the error with our error handler
      return handleError(error);
    } finally {
      // Finish the transaction
      transaction.finish();
    }
  };
}

/**
 * Add custom tags to the current Sentry scope
 */
export function addApiTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Add custom context to the current Sentry scope
 */
export function addApiContext(name: string, context: Record<string, any>) {
  setContext(name, context);
}

/**
 * Measure performance of a code block
 */
export async function measurePerformance<T>(
  name: string,
  operation: () => Promise<T>,
): Promise<T> {
  const span = Sentry.getCurrentScope().getSpan();
  const childSpan = span?.startChild({
    op: "function",
    description: name,
  });

  try {
    const result = await operation();
    childSpan?.setStatus("ok");
    return result;
  } catch (error) {
    childSpan?.setStatus("internal_error");
    throw error;
  } finally {
    childSpan?.finish();
  }
}
