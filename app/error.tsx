"use client";

/**
 * Route-level Error Boundary — catches errors in page/layout rendering.
 * Sentry captures the error automatically; this provides the user-facing UI.
 */

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: "route-error" },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="mb-3 text-xl font-semibold text-slate-900">Something went wrong</h2>
        <p className="mb-6 text-slate-600">
          We hit an unexpected error. Our team has been notified and is looking into it.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
