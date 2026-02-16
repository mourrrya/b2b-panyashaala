"use client";

/**
 * Global Error Boundary — catches errors in the root layout itself.
 * This is the last resort; it renders its own <html>/<body> because
 * the root layout may have failed.
 */

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: "global-error" },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="mb-6 text-slate-600">
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
