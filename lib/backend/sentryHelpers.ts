/**
 * API Route Helpers with Sentry Integration
 * ==========================================
 * Utilities to wrap API routes with tracing and error handling.
 */

import { addBreadcrumb, setContext, setSentryUser } from "@/lib/sentry";
import * as Sentry from "@sentry/nextjs";
import { auth } from "@/lib/auth";
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

    // Use withScope and startSpan for Sentry v8
    return await Sentry.withScope(async (scope) => {
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
            const session = await auth();
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

        // Execute the handler with Sentry tracing
        const response = await Sentry.startSpan(
          {
            name: operationName,
            op: "http.server",
            attributes: extractRequestContext(request),
          },
          async (span) => {
            const result = await handler(request, ...args);
            
            // Set response status tag
            scope.setTag("http.status_code", String(result.status));
            
            // Add breadcrumb for response
            addBreadcrumb(
              `API Response: ${operationName}`,
              "http",
              result.status < 400 ? "info" : "error",
              { status: result.status },
            );

            return result;
          }
        );

        return response;
      } catch (error) {
        // Set error tag
        scope.setTag("error", "true");

        // Add breadcrumb for error
        addBreadcrumb(
          `API Error: ${operationName}`,
          "http",
          "error",
          { error: String(error) },
        );

        // Handle the error with our error handler
        return handleError(error);
      }
    });
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
  return await Sentry.startSpan(
    {
      name,
      op: "function",
    },
    async () => {
      return await operation();
    }
  );
}
