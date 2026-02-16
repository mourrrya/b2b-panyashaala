# Sentry Error Tracking & Slack Integration Guide

This document provides a comprehensive guide for configuring Sentry error tracking with Slack notifications for the B2B Panyashaala application.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Sentry Setup](#sentry-setup)
4. [Environment Variables](#environment-variables)
5. [Slack Integration](#slack-integration)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The application now includes comprehensive error tracking and monitoring using Sentry, with real-time notifications via Slack. This setup provides:

- **Error Tracking**: Automatic capture of errors with full stack traces
- **Performance Monitoring**: Track API response times and database queries
- **Session Replay**: Replay user sessions when errors occur
- **Breadcrumbs**: Track user actions leading to errors
- **Contextual Data**: User information, request details, and custom context
- **PII Scrubbing**: Automatic removal of sensitive data
- **Slack Notifications**: Real-time alerts for critical errors

## Prerequisites

1. **Sentry Account**: Create a free account at [sentry.io](https://sentry.io/)
2. **Slack Workspace**: Access to a Slack workspace where you can add integrations
3. **Node.js**: Version 18+ (already required by Next.js)

## Sentry Setup

### Step 1: Create a Sentry Project

1. Log in to [Sentry](https://sentry.io/)
2. Click "Create Project"
3. Select "Next.js" as the platform
4. Name your project (e.g., "b2b-panyashaala-production")
5. Copy the **DSN** (Data Source Name) - you'll need this for environment variables

### Step 2: Get Additional Sentry Information

For source map uploads (optional but recommended for production):

1. Go to **Settings** > **Account** > **API** > **Auth Tokens**
2. Click "Create New Token"
3. Give it a name (e.g., "b2b-panyashaala-deploy")
4. Select scopes: `project:read`, `project:write`, `project:releases`
5. Copy the auth token

Get your organization and project names:
- **Organization**: Found in Settings > General Settings
- **Project**: Your project name (from Step 1)

## Environment Variables

Create or update your `.env.local` file with the following variables:

### Required Variables

```bash
# Sentry DSN (from Sentry project settings)
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Public DSN (same as above, for client-side errors)
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Environment (production, staging, development)
NODE_ENV=production
```

### Optional Variables (for Source Maps)

```bash
# Sentry organization slug
SENTRY_ORG=your-org-name

# Sentry project slug
SENTRY_PROJECT=b2b-panyashaala-production

# Auth token for uploading source maps
SENTRY_AUTH_TOKEN=your-auth-token-here
```

### Development Variables

For testing Sentry in development:

```bash
# Enable Sentry in development mode
SENTRY_ENABLED=true
NEXT_PUBLIC_SENTRY_ENABLED=true
```

### Production Deployment

For Vercel or other hosting platforms, add these as environment variables in your deployment settings:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with appropriate values
4. Redeploy your application

## Slack Integration

### Step 1: Connect Slack to Sentry

1. Log in to your Sentry account
2. Navigate to **Settings** > **Integrations**
3. Find "Slack" in the list
4. Click **Add to Slack**
5. Select your Slack workspace
6. Authorize the Sentry app
7. Choose which Slack channels Sentry can access

### Step 2: Create Alert Rules

Create alert rules to send notifications to Slack:

1. Go to **Alerts** in your Sentry project
2. Click **Create Alert Rule**
3. Choose "Issues" alert type

#### Recommended Alert Rules

**Critical Errors Alert:**
- **Name**: "Critical Errors"
- **Conditions**: 
  - Issue severity equals "error" or "fatal"
  - AND Environment equals "production"
- **Filters**: Issue is not resolved
- **Actions**: Send a Slack notification to #critical-alerts
- **Rate Limit**: Max 5 notifications per minute

**High-Impact User Errors:**
- **Name**: "High-Impact User Errors"
- **Conditions**:
  - Issue is seen by more than 10 users
  - AND Issue has occurred more than 50 times
- **Actions**: Send a Slack notification to #error-alerts
- **Rate Limit**: Max 10 notifications per hour

**Server Errors:**
- **Name**: "Server 5xx Errors"
- **Conditions**:
  - Tag "http.status_code" starts with "5"
  - AND Environment equals "production"
- **Actions**: Send a Slack notification to #server-alerts
- **Rate Limit**: Max 20 notifications per hour

**Authentication Failures:**
- **Name**: "Auth Failures"
- **Conditions**:
  - Tag "errorClass" equals "authentication"
  - AND Issue occurs more than 10 times in 5 minutes
- **Actions**: Send a Slack notification to #security-alerts
- **Rate Limit**: Max 5 notifications per minute

### Step 3: Customize Slack Notifications

In each alert rule, customize the Slack notification format:

1. Click on the Slack action
2. Choose the channel
3. Optionally customize the message template
4. Test the notification

## Usage Examples

### Automatic Error Tracking

Most errors are automatically tracked. The error handler in `lib/backend/errorHandler.ts` automatically sends errors to Sentry with appropriate context.

```typescript
// In your API route
import { handleError } from "@/lib/backend/errorHandler";

export async function GET(request: NextRequest) {
  try {
    // Your code here
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error); // Automatically tracked
  }
}
```

### Manual Error Tracking

For custom error tracking with additional context:

```typescript
import { captureException, addBreadcrumb } from "@/lib/sentry";

// Add breadcrumb before operation
addBreadcrumb("Starting payment process", "payment", "info", {
  amount: 100,
  currency: "USD"
});

try {
  // Your code
} catch (error) {
  captureException(error, {
    tags: {
      module: "payment",
      severity: "high"
    },
    extra: {
      paymentId: "123",
      userId: "456"
    }
  });
}
```

### API Route with Tracing

Wrap your API routes for automatic performance tracing:

```typescript
import { withSentryAPI } from "@/lib/backend/sentryHelpers";

export const GET = withSentryAPI(
  async (request) => {
    // Your handler code
    return NextResponse.json({ data: result });
  },
  { operationName: "GET /api/products" }
);
```

### Measure Performance

Track specific operations:

```typescript
import { measurePerformance } from "@/lib/backend/sentryHelpers";

const products = await measurePerformance(
  "Fetch products from database",
  async () => {
    return await prisma.product.findMany();
  }
);
```

## Best Practices

### 1. Error Classification

Always use appropriate error classes:

- `ErrorNotFound` - Resource not found (404)
- `ErrorAuth` - Authentication failures (401)
- `ErrorForbidden` - Authorization failures (403)
- `ErrorValidation` - Validation errors (422)
- `ErrorInvalidRequest` - Bad requests (400)
- `ErrorUnknown` - Server errors (500)

### 2. Add Context

Always add relevant context to errors:

```typescript
throw new ErrorApp("Payment failed", 500, null, {
  paymentId: "123",
  amount: 100,
  provider: "stripe"
});
```

### 3. Use Breadcrumbs

Add breadcrumbs for critical user actions:

```typescript
addBreadcrumb("User added item to cart", "user-action", "info", {
  productId: "123",
  quantity: 2
});
```

### 4. Set User Context

Set user context at the start of authenticated requests:

```typescript
import { setSentryUser } from "@/lib/sentry";

const session = await getServerSession();
if (session?.user) {
  setSentryUser(session.user);
}
```

### 5. Don't Report Expected Errors

Client errors (4xx) are usually expected and shouldn't spam Sentry:

- The error handler automatically filters these
- Only authentication/authorization errors are reported
- Validation errors are not reported to Sentry

### 6. Scrub Sensitive Data

Sensitive data is automatically scrubbed, but always verify:

- Passwords
- API keys
- Tokens
- Credit card numbers
- Personal information

### 7. Monitor Performance

Use transactions for critical paths:

```typescript
import * as Sentry from "@sentry/nextjs";

const transaction = Sentry.startTransaction({
  name: "Checkout Process",
  op: "business-logic"
});

try {
  // Your checkout logic
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN**: Verify `SENTRY_DSN` is set correctly
2. **Check Environment**: Sentry is disabled in development by default
3. **Enable Debug Mode**: Set `debug: true` in Sentry config
4. **Check Network**: Ensure your server can reach sentry.io
5. **Verify Build**: Run `npm run build` to ensure Sentry is integrated

### Source Maps Not Working

1. **Check Auth Token**: Verify `SENTRY_AUTH_TOKEN` is correct
2. **Check Org/Project**: Verify `SENTRY_ORG` and `SENTRY_PROJECT`
3. **Build Logs**: Check build logs for source map upload errors
4. **Permissions**: Ensure auth token has correct scopes

### Slack Notifications Not Sending

1. **Check Integration**: Verify Slack is connected in Sentry
2. **Check Alert Rules**: Ensure alert rules are active
3. **Check Conditions**: Verify alert conditions match your errors
4. **Test Alert**: Use "Test" button in alert rule settings
5. **Rate Limits**: Check if rate limits are preventing notifications

### Too Many Notifications

1. **Adjust Rate Limits**: Increase rate limit intervals
2. **Refine Conditions**: Make alert conditions more specific
3. **Use Filters**: Add filters to exclude certain errors
4. **Adjust Sample Rate**: Lower the `tracesSampleRate` in config

### Performance Issues

1. **Lower Sample Rate**: Reduce `tracesSampleRate` to 0.1 or lower
2. **Disable Replay**: Set `replaysSessionSampleRate` to 0
3. **Reduce Breadcrumbs**: Limit breadcrumb usage
4. **Optimize Transactions**: Only trace critical operations

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Slack Integration](https://docs.sentry.io/product/integrations/notification-incidents/slack/)
- [Sentry Alert Rules](https://docs.sentry.io/product/alerts/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)

## Support

For issues or questions:

1. Check Sentry documentation
2. Check application logs
3. Review this guide
4. Contact the development team
