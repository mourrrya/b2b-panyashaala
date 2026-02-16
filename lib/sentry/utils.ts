/**
 * Sentry Utilities
 * ================
 * Utilities for enhanced error tracking, context management, and integrations.
 */

import * as Sentry from "@sentry/nextjs";
import type { User } from "next-auth";

/**
 * Set user context for Sentry
 * This helps identify which user encountered an error
 */
export function setSentryUser(user: User | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email || undefined,
      username: user.name || undefined,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for user actions
 * Breadcrumbs help trace the sequence of events leading to an error
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: "debug" | "info" | "warning" | "error" = "info",
  data?: Record<string, any>,
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: Sentry.SeverityLevel;
    user?: User | null;
  },
) {
  // Set context if provided
  if (context) {
    Sentry.withScope((scope) => {
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      if (context.level) {
        scope.setLevel(context.level);
      }

      if (context.user) {
        setSentryUser(context.user);
      }

      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  },
) {
  if (context) {
    Sentry.withScope((scope) => {
      if (context.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      scope.setLevel(level);
      Sentry.captureMessage(message);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Start a new transaction for performance tracing
 * @deprecated Use Sentry's automatic tracing or startSpan in Sentry v8
 */
export function startTransaction(name: string, op: string, data?: Record<string, any>) {
  // In Sentry v8, use startSpan instead
  // This is kept for backwards compatibility but will use current span
  return Sentry.getCurrentScope().getSpan();
}

/**
 * Set context for the current scope
 */
export function setContext(name: string, context: Record<string, any>) {
  Sentry.setContext(name, context);
}

/**
 * Set a tag for categorization
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Set multiple tags at once
 */
export function setTags(tags: Record<string, string>) {
  Sentry.setTags(tags);
}

/**
 * Clear the current scope
 */
export function clearScope() {
  Sentry.setUser(null);
  Sentry.setContext("custom", {});
}

/**
 * Send a test error to verify Sentry configuration
 * USE ONLY FOR TESTING
 */
export function sendTestError() {
  if (process.env.NODE_ENV === "development") {
    captureMessage("Test message from Sentry utilities", "info", {
      tags: { test: "true" },
    });
    throw new Error("Test error from Sentry utilities");
  }
}

/**
 * Notify Slack via Sentry integration
 * Note: Configure Slack integration in Sentry dashboard under Settings > Integrations
 * You can set up alerts to send notifications to Slack channels based on:
 * - Error severity
 * - Specific error types
 * - Custom tags
 * - User impact
 */
export function configureSlackNotification() {
  // This is handled in Sentry dashboard:
  // 1. Go to Settings > Integrations > Slack
  // 2. Connect your Slack workspace
  // 3. Create alert rules for:
  //    - Critical errors (severity: error, fatal)
  //    - High-impact issues (user-affected)
  //    - Specific error types (tags)
  // 4. Configure notification format and channels
  return {
    instructions: [
      "1. Log in to Sentry dashboard",
      "2. Navigate to Settings > Integrations",
      "3. Find and click 'Slack' integration",
      "4. Click 'Add to Slack' and authorize",
      "5. Go to Alerts > Create Alert Rule",
      "6. Set conditions (e.g., error severity, tags)",
      "7. Select Slack channel for notifications",
      "8. Customize notification format",
    ],
  };
}
