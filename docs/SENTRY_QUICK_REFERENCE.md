# Sentry Quick Reference

## Error Capture — What Gets Reported

| Layer                                               | What                                                      | Reported?   |
| --------------------------------------------------- | --------------------------------------------------------- | ----------- |
| **Server API** (`handleError`)                      | `ErrorUnknown` / any 5xx                                  | ✅ Always   |
| **Server API**                                      | `ErrorAuth`, `ErrorForbidden`                             | ✅ Always   |
| **Server API**                                      | `ErrorValidation`, `ErrorNotFound`, `ErrorInvalidRequest` | ❌ Expected |
| **RSC / Middleware** (`onRequestError`)             | Any unhandled throw                                       | ✅ Always   |
| **Client render** (`error.tsx`, `global-error.tsx`) | React component crash                                     | ✅ Always   |
| **Client HTTP** (Axios interceptor)                 | 5xx, 401, 403                                             | ✅ Always   |
| **Client HTTP** (Axios interceptor)                 | Network failures                                          | ✅ Warning  |
| **Client HTTP** (Axios interceptor)                 | 400, 404, 422, 409                                        | ❌ Expected |
| **Auth store / form hooks**                         | Any caught exception                                      | ✅ Always   |

## API Routes — Wrap with Tracing

```ts
import { withSentryAPI } from "@/lib/backend/sentryHelpers";

export const GET = withSentryAPI(
  async (request) => {
    const data = await getProducts();
    return NextResponse.json({ data, success: true });
  },
  { operationName: "GET /api/products" },
);
```

`withSentryAPI` auto-attaches: user context, request breadcrumb, span tracing, and falls through to `handleError` on throw.

## Error Classes

```ts
import {
  ErrorNotFound,
  ErrorAuth,
  ErrorValidation,
  ErrorUnknown,
} from "@/lib/backend/errorHandler";

throw new ErrorNotFound("Product not found");
throw new ErrorAuth(); // defaults to "Authentication failed"
throw new ErrorValidation("Bad email", zodIssues); // 422 + details
throw new ErrorUnknown("DB failure", undefined, { query: "..." }); // 500 + context
```

## Manual Capture

```ts
import {
  captureException,
  captureMessage,
  addBreadcrumb,
  setSentryUser,
  setContext,
} from "@/lib/sentry";

// Before an operation — leaves a trail
addBreadcrumb("Starting checkout", "checkout", "info", { cartSize: 3 });

// Capture with tags + extras
captureException(error, {
  level: "error",
  tags: { layer: "payment", provider: "stripe" },
  extra: { orderId: "abc" },
});

// Capture a message
captureMessage("Fallback provider used", "warning");

// Set user (auto-done in withSentryAPI)
setSentryUser(session.user);
```

## Performance

```ts
import { measurePerformance } from "@/lib/backend/sentryHelpers";

const products = await measurePerformance("fetch-products", () => prisma.product.findMany());
```

## Tag Conventions

Use consistent tags so Sentry filters are useful:

| Tag                | Values                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `layer`            | `api`, `auth`, `axios`, `form`, `email`, `turnstile`                                             |
| `errorClass`       | `authentication`, `authorization`, `not_found`, `validation`, `conflict`, `unknown`, `unhandled` |
| `errorType`        | `server`, `client`, `network`                                                                    |
| `http.status_code` | `401`, `500`, etc.                                                                               |
| `runtime`          | `browser`, `server`, `edge`                                                                      |

## Environment

```bash
# Required
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Optional — source maps
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_...

# Dev only — enable locally
SENTRY_ENABLED=true
NEXT_PUBLIC_SENTRY_ENABLED=true
```
