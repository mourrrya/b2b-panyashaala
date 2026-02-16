# Error Handling & Monitoring Implementation

## Overview

This implementation adds comprehensive error tracking, monitoring, and real-time notifications to the B2B Panyashaala application using Sentry and Slack.

## What's Been Implemented

### 1. Sentry Integration

✅ **Core Setup**
- Installed `@sentry/nextjs` SDK
- Created initialization files for all runtime environments (server, client, edge)
- Integrated with Next.js via `instrumentation.ts` and `next.config.mjs`

✅ **Error Tracking**
- Enhanced error handler with automatic Sentry reporting
- Added error classification (client vs server errors)
- Implemented contextual error capture with tags and metadata
- Created custom error classes with context support

✅ **Performance Monitoring**
- API route tracing with `withSentryAPI` wrapper
- Database query tracing (Prisma integration)
- Custom performance measurement utilities
- Transaction and span tracking for critical operations

✅ **Security & Privacy**
- Automatic PII scrubbing from error reports
- Sensitive data removal from headers, cookies, and query params
- Secure credential handling
- Environment-based filtering

### 2. Slack Integration Setup

✅ **Documentation**
- Comprehensive setup guide for Slack integration
- Alert rule templates for different error types
- Notification configuration examples
- Best practices for reducing noise

### 3. Developer Experience

✅ **Utilities & Helpers**
- `lib/sentry/utils.ts` - Manual error capture and context management
- `lib/backend/sentryHelpers.ts` - API route wrappers and performance tracking
- `lib/backend/errorHandler.ts` - Enhanced error handling with Sentry integration

✅ **Documentation**
- `/docs/SENTRY_SETUP.md` - Complete setup guide with step-by-step instructions
- `/docs/SENTRY_QUICK_REFERENCE.md` - Quick reference for developers
- `.env.example` - Environment variable template

✅ **Code Examples**
- Updated API routes demonstrating Sentry usage
- Service layer error handling patterns
- Context and breadcrumb usage examples

## File Structure

```
/
├── instrumentation.ts              # Next.js instrumentation entry point
├── sentry.client.config.ts         # Client-side Sentry configuration
├── sentry.server.config.ts         # Server-side Sentry configuration
├── sentry.edge.config.ts           # Edge runtime Sentry configuration
├── next.config.mjs                 # Updated with Sentry webpack plugin
├── .env.example                    # Environment variables template
│
├── lib/
│   ├── sentry/
│   │   ├── index.ts                # Sentry exports
│   │   └── utils.ts                # Sentry utility functions
│   │
│   └── backend/
│       ├── errorHandler.ts         # Enhanced error handler (modified)
│       └── sentryHelpers.ts        # API route helpers with tracing
│
├── docs/
│   ├── SENTRY_SETUP.md             # Complete setup guide
│   └── SENTRY_QUICK_REFERENCE.md   # Developer quick reference
│
└── app/api/
    ├── products/route.ts           # Example: API route with Sentry
    ├── products/[id]/route.ts      # Example: Dynamic route with Sentry
    └── services/
        └── productServices.ts      # Example: Service with error context
```

## Quick Start

### 1. Install Dependencies

Dependencies are already installed:
```bash
npm install @sentry/nextjs
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your Sentry DSN:

```bash
cp .env.example .env.local
```

Required variables:
```bash
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
```

### 3. Create Sentry Project

1. Sign up at [sentry.io](https://sentry.io/)
2. Create a new Next.js project
3. Copy the DSN to your `.env.local`

### 4. Configure Slack Notifications

1. In Sentry dashboard, go to Settings > Integrations
2. Connect Slack workspace
3. Create alert rules (see `/docs/SENTRY_SETUP.md`)

### 5. Deploy

Deploy to Vercel or your hosting platform with the environment variables set.

## Usage Examples

### Automatic Error Tracking

Errors are automatically tracked:

```typescript
import { handleError } from "@/lib/backend/errorHandler";

export async function GET(request: NextRequest) {
  try {
    // Your code here
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleError(error); // Automatically tracked in Sentry
  }
}
```

### API Route with Tracing

Wrap routes for performance monitoring:

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

### Manual Error Capture

Capture errors with custom context:

```typescript
import { captureException, addBreadcrumb } from "@/lib/sentry";

addBreadcrumb("User initiated checkout", "user-action", "info");

try {
  // Your code
} catch (error) {
  captureException(error, {
    tags: { module: "checkout" },
    extra: { orderId: "123" }
  });
}
```

## Features

### Error Classification

- ✅ Server errors (5xx) automatically reported
- ✅ Client errors (4xx) filtered (except auth)
- ✅ Custom error classes with context
- ✅ Severity levels and tagging

### Performance Monitoring

- ✅ API route response times
- ✅ Database query tracking (Prisma)
- ✅ Custom operation measurement
- ✅ Transaction tracing

### Context & Debugging

- ✅ User information (when authenticated)
- ✅ Request details (method, URL, headers)
- ✅ Breadcrumbs for user actions
- ✅ Custom tags and metadata
- ✅ Stack traces and source maps

### Security

- ✅ Automatic PII scrubbing
- ✅ Sensitive header removal
- ✅ Query parameter sanitization
- ✅ Form data filtering
- ✅ Error message sanitization

### Slack Notifications

- ✅ Real-time error alerts
- ✅ Configurable severity filtering
- ✅ Rate limiting to prevent spam
- ✅ Custom notification formatting
- ✅ Multiple channel support

## Configuration Options

### Sentry Configuration

Edit the Sentry config files to customize:

- **Sample Rates**: Adjust `tracesSampleRate` for performance monitoring
- **Integrations**: Enable/disable specific integrations
- **Ignored Errors**: Add patterns for errors to ignore
- **Before Send Hook**: Customize data scrubbing

### Environment-Specific Behavior

- **Development**: Errors not sent unless `SENTRY_ENABLED=true`
- **Production**: All errors automatically captured and reported
- **Staging**: Use separate Sentry project with different DSN

## Monitoring & Alerts

### Recommended Alert Rules

1. **Critical Errors**: Severity = error/fatal, Environment = production
2. **High-Impact Issues**: Seen by >10 users, Occurred >50 times
3. **Server Errors**: Tag http.status_code starts with "5"
4. **Auth Failures**: Tag errorClass = "authentication", >10 times in 5 min

### Dashboard Views

Monitor in Sentry:
- **Issues**: All captured errors with grouping
- **Performance**: API response times and slow operations
- **Replays**: Session recordings when errors occur
- **Releases**: Error trends across deployments

## Testing

### Test in Development

```bash
# Enable Sentry
export SENTRY_ENABLED=true
export NEXT_PUBLIC_SENTRY_ENABLED=true

# Run the app
npm run dev

# Trigger an error and check Sentry dashboard
```

### Verify Production

After deployment:
1. Check Sentry dashboard for incoming events
2. Verify source maps are uploaded
3. Test Slack notifications
4. Review error grouping

## Documentation

- **[Complete Setup Guide](./docs/SENTRY_SETUP.md)**: Step-by-step Sentry and Slack setup
- **[Quick Reference](./docs/SENTRY_QUICK_REFERENCE.md)**: Common patterns and examples
- **[Environment Variables](./.env.example)**: Required configuration

## Best Practices

1. **Always add context** to errors for better debugging
2. **Use breadcrumbs** to track user journey
3. **Classify errors properly** using specific error classes
4. **Don't over-report** - filter expected errors
5. **Use tags** for easy filtering in Sentry
6. **Measure critical paths** with performance tracking
7. **Review alerts regularly** and adjust thresholds

## Benefits

### For Developers

- 🔍 **Better Debugging**: Full context and stack traces
- ⚡ **Performance Insights**: Identify slow operations
- 🎯 **Focused Alerts**: Only actionable errors
- 📊 **Metrics**: Track error rates and trends

### For Operations

- 🚨 **Real-time Alerts**: Instant Slack notifications
- 🔒 **Security**: Automatic PII protection
- 📈 **Monitoring**: Track application health
- 🛡️ **Reliability**: Catch issues before users report them

### For Business

- ⏱️ **Faster Resolution**: Quick error identification
- 😊 **Better UX**: Fewer user-facing errors
- 💰 **Cost Savings**: Reduce debugging time
- 📊 **Data-Driven**: Make informed decisions

## Support & Resources

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Slack Integration Guide](https://docs.sentry.io/product/integrations/notification-incidents/slack/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

## Troubleshooting

Common issues and solutions:

### Errors not appearing in Sentry
- Verify DSN is set correctly
- Check environment (disabled in dev by default)
- Enable debug mode in config

### Source maps not working
- Verify auth token has correct permissions
- Check build logs for upload errors
- Ensure SENTRY_ORG and SENTRY_PROJECT are set

### Slack notifications not sending
- Verify Slack integration is connected
- Check alert rule conditions
- Review rate limits

See [SENTRY_SETUP.md](./docs/SENTRY_SETUP.md) for more details.

## Next Steps

1. **Set up Sentry account** and get DSN
2. **Configure environment variables** in your deployment
3. **Set up Slack integration** and create alert rules
4. **Test the integration** in staging environment
5. **Deploy to production** and monitor

## Contributing

When adding new features:

1. Use `withSentryAPI` for new API routes
2. Add breadcrumbs for critical user actions
3. Include context in custom errors
4. Update documentation if needed

## License

This implementation follows the project's existing license.
