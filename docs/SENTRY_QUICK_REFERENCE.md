# Sentry Quick Reference Guide

Quick reference for using Sentry in the B2B Panyashaala application.

## Table of Contents

- [Automatic Error Tracking](#automatic-error-tracking)
- [API Routes with Tracing](#api-routes-with-tracing)
- [Manual Error Capture](#manual-error-capture)
- [Adding Context](#adding-context)
- [Performance Tracking](#performance-tracking)
- [Best Practices](#best-practices)

## Automatic Error Tracking

Most errors are automatically captured by the error handler. Simply use the standard error classes:

```typescript
import { ErrorNotFound, ErrorAuth, ErrorValidation } from "@/lib/backend/errorHandler";

// Throws and automatically reports to Sentry
throw new ErrorNotFound("Product not found");
```

### Error Classes

- `ErrorNotFound` - 404 errors (not reported to Sentry)
- `ErrorAuth` - 401 authentication errors (reported)
- `ErrorForbidden` - 403 authorization errors (reported)
- `ErrorValidation` - 422 validation errors (not reported)
- `ErrorInvalidRequest` - 400 bad requests (not reported)
- `ErrorAlreadyExists` - 409 conflict errors (not reported)
- `ErrorUnknown` - 500 server errors (reported)

## API Routes with Tracing

Wrap your API route handlers for automatic tracing and error handling:

```typescript
import { withSentryAPI } from "@/lib/backend/sentryHelpers";

// Basic usage
export const GET = withSentryAPI(
  async (request) => {
    // Your handler code
    return NextResponse.json({ data: result });
  },
  { operationName: "GET /api/products" }
);

// With route parameters
export const GET = withSentryAPI(
  async (request, context) => {
    const { id } = await context.params;
    // Your handler code
    return NextResponse.json({ data: result });
  },
  { operationName: "GET /api/products/[id]" }
);
```

## Manual Error Capture

For custom error tracking with additional context:

```typescript
import { captureException, captureMessage } from "@/lib/sentry";

// Capture an exception
try {
  // Your code
} catch (error) {
  captureException(error, {
    level: "error", // 'debug' | 'info' | 'warning' | 'error' | 'fatal'
    tags: {
      module: "payment",
      severity: "high"
    },
    extra: {
      paymentId: "123",
      amount: 100
    }
  });
}

// Capture a message
captureMessage("Payment processing started", "info", {
  tags: { module: "payment" },
  extra: { orderId: "123" }
});
```

## Adding Context

### User Context

```typescript
import { setSentryUser } from "@/lib/sentry";

// Set user context (automatically done in withSentryAPI)
const session = await getServerSession();
if (session?.user) {
  setSentryUser(session.user);
}

// Clear user context
setSentryUser(null);
```

### Breadcrumbs

Track user actions leading to errors:

```typescript
import { addBreadcrumb } from "@/lib/sentry";

// Add breadcrumb
addBreadcrumb(
  "User added item to cart",
  "user-action",
  "info",
  {
    productId: "123",
    quantity: 2
  }
);

// Common categories
addBreadcrumb("Database query executed", "database", "debug");
addBreadcrumb("API call initiated", "http", "info");
addBreadcrumb("Authentication failed", "auth", "warning");
addBreadcrumb("Payment failed", "payment", "error");
```

### Custom Context

```typescript
import { setContext, setTag, setTags } from "@/lib/sentry";

// Set context
setContext("payment", {
  provider: "stripe",
  amount: 100,
  currency: "USD"
});

// Set tags
setTag("environment", "production");
setTags({
  feature: "checkout",
  version: "2.0"
});
```

### Error Context

Add context directly to errors:

```typescript
import { ErrorUnknown } from "@/lib/backend/errorHandler";

// Create error with context
throw new ErrorUnknown(
  "Payment processing failed",
  undefined, // errors (optional)
  {
    paymentId: "123",
    provider: "stripe",
    amount: 100
  }
);
```

## Performance Tracking

### Measure Operations

```typescript
import { measurePerformance } from "@/lib/backend/sentryHelpers";

// Measure a database query
const products = await measurePerformance(
  "Fetch products from database",
  async () => {
    return await prisma.product.findMany();
  }
);

// Measure an API call
const response = await measurePerformance(
  "Fetch from external API",
  async () => {
    return await fetch("https://api.example.com/data");
  }
);
```

### Custom Transactions

```typescript
import * as Sentry from "@sentry/nextjs";

// Start a transaction
const transaction = Sentry.startTransaction({
  name: "Checkout Process",
  op: "business-logic"
});

try {
  // Your code
  const cart = await fetchCart();
  const payment = await processPayment();
  const order = await createOrder();
  
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

## Best Practices

### 1. Always Add Context

```typescript
// ❌ Bad - no context
throw new ErrorUnknown("Database error");

// ✅ Good - with context
throw new ErrorUnknown("Failed to fetch products", undefined, {
  filters: { category: "oils" },
  userId: "123"
});
```

### 2. Use Breadcrumbs

```typescript
// Track user journey
addBreadcrumb("User viewed product", "navigation", "info", { productId: "123" });
addBreadcrumb("User added to cart", "user-action", "info", { quantity: 2 });
addBreadcrumb("User initiated checkout", "user-action", "info");
// Error occurs here - breadcrumbs help trace the path
```

### 3. Classify Errors Properly

```typescript
// ❌ Bad - generic error
throw new Error("Something went wrong");

// ✅ Good - specific error class
throw new ErrorValidation("Invalid email format", { email: "invalid" });
```

### 4. Don't Over-Report

```typescript
// ❌ Bad - reports every validation error
if (!email) {
  captureException(new Error("Email missing"));
  throw new ErrorValidation("Email is required");
}

// ✅ Good - validation errors are not reported automatically
if (!email) {
  throw new ErrorValidation("Email is required");
}
```

### 5. Use Tags for Filtering

```typescript
// Makes it easy to filter errors in Sentry dashboard
captureException(error, {
  tags: {
    module: "checkout",
    paymentProvider: "stripe",
    feature: "subscription"
  }
});
```

### 6. Measure Critical Paths

```typescript
// Track performance of critical operations
const order = await measurePerformance(
  "Create order with payment",
  async () => {
    return await createOrderWithPayment(data);
  }
);
```

## Common Patterns

### API Route Pattern

```typescript
import { withSentryAPI } from "@/lib/backend/sentryHelpers";
import { handleError } from "@/lib/backend/errorHandler";
import { addBreadcrumb } from "@/lib/sentry";

async function handler(request: NextRequest) {
  try {
    // Add breadcrumb
    addBreadcrumb("Processing request", "http", "info");
    
    // Your logic
    const result = await processRequest(request);
    
    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withSentryAPI(handler, {
  operationName: "POST /api/endpoint"
});
```

### Service Layer Pattern

```typescript
import { ErrorUnknown, ErrorNotFound } from "@/lib/backend/errorHandler";

export async function getResource(id: string) {
  try {
    const resource = await prisma.resource.findUnique({ where: { id } });
    
    if (!resource) {
      throw new ErrorNotFound("Resource");
    }
    
    return resource;
  } catch (error) {
    // Re-throw known errors
    if (error instanceof ErrorNotFound) {
      throw error;
    }
    
    // Wrap unknown errors with context
    throw new ErrorUnknown("Failed to fetch resource", undefined, {
      resourceId: id,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
```

## Environment-Specific Configuration

### Development

```bash
# .env.local
SENTRY_ENABLED=false
```

Errors are not sent to Sentry unless explicitly enabled.

### Production

```bash
# Vercel environment variables
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
NODE_ENV=production
```

All errors are automatically sent to Sentry.

## Testing Sentry

To test Sentry integration in development:

```bash
# Enable Sentry
SENTRY_ENABLED=true
NEXT_PUBLIC_SENTRY_ENABLED=true

# Run the app
npm run dev
```

Then trigger an error and check your Sentry dashboard.

## Related Documentation

- [Full Setup Guide](./SENTRY_SETUP.md)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Handler Source](../lib/backend/errorHandler.ts)
- [Sentry Utilities](../lib/sentry/utils.ts)
