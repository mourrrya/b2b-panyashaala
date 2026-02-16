/**
 * Sentry Utilities — thin wrappers over @sentry/nextjs.
 * Keep this file lean; every export should be actively used.
 */

import * as Sentry from "@sentry/nextjs";
import type { User } from "next-auth";

/** Attach user to all subsequent Sentry events. Pass `null` to clear. */
export function setSentryUser(user: Pick<User, "id" | "email" | "name"> | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email ?? undefined,
      username: user.name ?? undefined,
    });
  } else {
    Sentry.setUser(null);
  }
}

/** Record a breadcrumb — shows up in the trail leading to the next error. */
export function addBreadcrumb(
  message: string,
  category: string,
  level: "debug" | "info" | "warning" | "error" = "info",
  data?: Record<string, unknown>,
) {
  Sentry.addBreadcrumb({ message, category, level, data });
}

/** Capture an exception with optional scoped tags / extras. */
export function captureException(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
    user?: Pick<User, "id" | "email" | "name"> | null;
  },
) {
  if (!context) {
    Sentry.captureException(error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context.tags) scope.setTags(context.tags);
    if (context.extra) scope.setExtras(context.extra);
    if (context.level) scope.setLevel(context.level);
    if (context.user) setSentryUser(context.user);
    Sentry.captureException(error);
  });
}

/** Capture a message with optional scoped tags / extras. */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!context) {
    Sentry.captureMessage(message, level);
    return;
  }

  Sentry.withScope((scope) => {
    if (context.tags) scope.setTags(context.tags);
    if (context.extra) scope.setExtras(context.extra);
    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

/** Set structured context on the current scope. */
export function setContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context);
}

/** Set a single tag on the current scope. */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/** Set multiple tags at once. */
export function setTags(tags: Record<string, string>) {
  Sentry.setTags(tags);
}
