import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { captureException } from "@/lib/sentry";
import { ErrorServerRes } from "@/types/api.payload.types";
import type { SeverityLevel } from "@sentry/nextjs";
import { NextResponse } from "next/server";

// =============================================================================
// Error classes — each maps to an HTTP status code
// =============================================================================

export class ErrorApp extends Error {
  constructor(
    public override message: string,
    public statusCode: number = HTTP_STATUS.BAD_REQUEST,
    public errors?: unknown,
    public context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorNotFound extends ErrorApp {
  constructor(message?: string, context?: Record<string, unknown>) {
    super(message || ERROR_MESSAGES.RESOURCE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, undefined, context);
  }
}

export class ErrorAuth extends ErrorApp {
  constructor(message?: string, context?: Record<string, unknown>) {
    super(
      message || ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED,
      HTTP_STATUS.UNAUTHORIZED,
      undefined,
      context,
    );
  }
}

export class ErrorForbidden extends ErrorApp {
  constructor(message?: string, context?: Record<string, unknown>) {
    super(message || ERROR_MESSAGES.RESOURCE.FORBIDDEN, HTTP_STATUS.FORBIDDEN, undefined, context);
  }
}

export class ErrorAlreadyExists extends ErrorApp {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, HTTP_STATUS.CONFLICT, undefined, context);
  }
}

export class ErrorValidation extends ErrorApp {
  constructor(message?: string, details?: unknown, context?: Record<string, unknown>) {
    super(
      message || ERROR_MESSAGES.VALIDATION.VALIDATION_FAILED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details,
      context,
    );
  }
}

export class ErrorInvalidRequest extends ErrorApp {
  constructor(message?: string, details?: unknown, context?: Record<string, unknown>) {
    super(
      message || ERROR_MESSAGES.VALIDATION.INVALID_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      details,
      context,
    );
  }
}

export class ErrorUnknown extends ErrorApp {
  constructor(message?: string, details?: unknown, context?: Record<string, unknown>) {
    super(message || ERROR_MESSAGES.UNKNOWN, HTTP_STATUS.INTERNAL_SERVER_ERROR, details, context);
  }
}

// =============================================================================
// Classify an ErrorApp into Sentry-friendly tags + severity
// =============================================================================

const ERROR_CLASS_MAP = new Map<Function, string>([
  [ErrorNotFound, "not_found"],
  [ErrorAuth, "authentication"],
  [ErrorForbidden, "authorization"],
  [ErrorValidation, "validation"],
  [ErrorInvalidRequest, "invalid_request"],
  [ErrorAlreadyExists, "conflict"],
  [ErrorUnknown, "unknown"],
]);

function classifyError(error: ErrorApp): {
  level: SeverityLevel;
  tags: Record<string, string>;
  shouldReport: boolean;
} {
  const tags: Record<string, string> = {};
  let level: SeverityLevel = "error";
  let shouldReport = true;

  if (error.statusCode >= 500) {
    tags.errorType = "server";
  } else {
    level = "warning";
    tags.errorType = "client";
    // Only report auth/forbidden client errors — the rest are expected user errors
    shouldReport = error instanceof ErrorAuth || error instanceof ErrorForbidden;
  }

  tags.errorClass = ERROR_CLASS_MAP.get(error.constructor) ?? "app";
  return { level, tags, shouldReport };
}

// =============================================================================
// Central error handler — every API route flows through here
// =============================================================================

export function handleError(error: unknown): NextResponse<ErrorServerRes> {
  // --- Known application errors ---
  if (error instanceof ErrorApp) {
    const { level, tags, shouldReport } = classifyError(error);

    if (shouldReport) {
      captureException(error, {
        level,
        tags,
        extra: {
          statusCode: error.statusCode,
          errors: error.errors,
          context: error.context,
        },
      });
    }

    const body: ErrorServerRes = { message: error.message, success: false };
    if (error.errors) body.errors = error.errors;
    return NextResponse.json(body, { status: error.statusCode });
  }

  // --- Standard Error objects (unexpected) ---
  if (error instanceof Error) {
    captureException(error, {
      level: "error",
      tags: { errorType: "server", errorClass: "unhandled" },
      extra: { errorName: error.name, stack: error.stack },
    });

    return NextResponse.json({ message: error.message, success: false } satisfies ErrorServerRes, {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }

  // --- Truly unknown (string thrown, etc.) ---
  captureException(new Error(`Non-Error thrown: ${String(error)}`), {
    level: "error",
    tags: { errorType: "server", errorClass: "unknown_type" },
    extra: { rawValue: String(error) },
  });

  return NextResponse.json(
    { message: ERROR_MESSAGES.INTERNAL_SERVER, success: false } satisfies ErrorServerRes,
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
  );
}
