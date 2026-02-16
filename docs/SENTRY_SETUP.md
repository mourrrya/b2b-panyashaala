# Sentry Setup & Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER                                                    │
│  sentry.client.config.ts    → replays, browser tracing      │
│  app/error.tsx              → React error boundary          │
│  app/global-error.tsx       → Root layout error boundary    │
│  Axios interceptor          → API call errors (5xx, auth)   │
│  Auth store / form hooks    → catch blocks → captureException│
├─────────────────────────────────────────────────────────────┤
│  SERVER (Node.js)                                           │
│  sentry.server.config.ts    → HTTP & Prisma integrations    │
│  instrumentation.ts         → register() + onRequestError   │
│  withSentryAPI()            → span tracing + handleError()  │
│  handleError()              → classifies & reports errors   │
├─────────────────────────────────────────────────────────────┤
│  EDGE                                                       │
│  sentry.edge.config.ts      → middleware error capture      │
└─────────────────────────────────────────────────────────────┘
```

## Files

| File                           | Purpose                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `sentry.client.config.ts`      | Browser Sentry init (replay, tracing)                                     |
| `sentry.server.config.ts`      | Node.js Sentry init (HTTP, Prisma integrations)                           |
| `sentry.edge.config.ts`        | Edge runtime Sentry init                                                  |
| `instrumentation.ts`           | Loads configs per runtime + `onRequestError`                              |
| `next.config.mjs`              | `withSentryConfig()` wrapper for source maps                              |
| `lib/sentry/utils.ts`          | Thin wrappers: `captureException`, `addBreadcrumb`, `setSentryUser`, etc. |
| `lib/backend/errorHandler.ts`  | Error classes + `handleError()` — central API error handler               |
| `lib/backend/sentryHelpers.ts` | `withSentryAPI()` wrapper + `measurePerformance()`                        |
| `lib/client/api/axios.ts`      | Axios interceptor — reports 5xx & auth errors to Sentry                   |
| `app/error.tsx`                | Route-level React error boundary                                          |
| `app/global-error.tsx`         | Root-level React error boundary                                           |

## Setup

### 1. Environment Variables

```bash
# Required
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]

# Source maps (optional, recommended for production)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_...

# Enable in development (both default to disabled)
SENTRY_ENABLED=true
NEXT_PUBLIC_SENTRY_ENABLED=true
```

### 2. Sentry Project

1. Create a project at [sentry.io](https://sentry.io) → select **Next.js**
2. Copy the DSN into your env vars
3. (Optional) Create an auth token at **Settings > Auth Tokens** with scopes: `project:read`, `project:write`, `project:releases`

### 3. Slack Alerts

1. **Settings > Integrations > Slack** → authorize
2. Create alert rules under **Alerts > Create Alert Rule**:

| Alert           | Condition                                       | Channel            |
| --------------- | ----------------------------------------------- | ------------------ |
| Critical Errors | severity = error/fatal AND env = production     | `#critical-alerts` |
| Auth Failures   | tag `errorClass` = authentication, >10 in 5 min | `#security-alerts` |
| Server 5xx      | tag `http.status_code` starts with 5            | `#server-alerts`   |

## How Errors Flow

### Server-side API routes

```
request → withSentryAPI() → handler() → throw ErrorXxx
                                              ↓
                                        handleError()
                                              ↓
                            classifyError() → captureException() → Sentry
                                              ↓
                                    NextResponse.json(error, status)
```

### Client-side

```
Component crash → error.tsx / global-error.tsx → Sentry.captureException()
Axios 5xx/auth  → interceptor                 → captureException()
Store catch     → captureException()           → Sentry
```

### RSC / Middleware (automatic)

```
Server Component throw → onRequestError (instrumentation.ts) → Sentry
```

## Debugging Checklist

- **Errors not appearing?** Check `SENTRY_DSN` is set. In dev, set `SENTRY_ENABLED=true`.
- **Source maps broken?** Verify `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
- **Too many alerts?** Lower `tracesSampleRate`, tighten alert rule conditions.
- **Slack not firing?** Test alert in Sentry UI. Check rate limits on the rule.

## Quick Reference

See [SENTRY_QUICK_REFERENCE.md](./SENTRY_QUICK_REFERENCE.md) for day-to-day usage patterns.
