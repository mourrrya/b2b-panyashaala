import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { captureException } from "@/lib/sentry";
import { ErrorServerRes } from "@/types/api.payload.types";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export class ErrorApp extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.BAD_REQUEST,
    public errors?: any,
    public context?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorNotFound extends ErrorApp {
  constructor(message?: string, context?: Record<string, any>) {
    super(message || ERROR_MESSAGES.RESOURCE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, undefined, context);
  }
}

export class ErrorAuth extends ErrorApp {
  constructor(message?: string, context?: Record<string, any>) {
    super(message || ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED, undefined, context);
  }
}

export class ErrorForbidden extends ErrorApp {
  constructor(message?: string, context?: Record<string, any>) {
    super(message || ERROR_MESSAGES.RESOURCE.FORBIDDEN, HTTP_STATUS.FORBIDDEN, undefined, context);
  }
}

export class ErrorAlreadyExists extends ErrorApp {
  constructor(message: string, context?: Record<string, any>) {
    super(`${message}`, HTTP_STATUS.CONFLICT, undefined, context);
  }
}

export class ErrorValidation extends ErrorApp {
  constructor(message?: string, details?: any, context?: Record<string, any>) {
    super(
      message || ERROR_MESSAGES.VALIDATION.VALIDATION_FAILED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details,
      context,
    );
  }
}

export class ErrorInvalidRequest extends ErrorApp {
  constructor(message?: string, details?: any, context?: Record<string, any>) {
    super(message || ERROR_MESSAGES.VALIDATION.INVALID_REQUEST, HTTP_STATUS.BAD_REQUEST, details, context);
  }
}

// unknown error handler
export class ErrorUnknown extends ErrorApp {
  constructor(message?: string, details?: any, context?: Record<string, any>) {
    super(message || ERROR_MESSAGES.UNKNOWN, HTTP_STATUS.INTERNAL_SERVER_ERROR, details, context);
  }
}

export function handleError(error: unknown): NextResponse<ErrorServerRes> {
  // Determine severity and tags based on error type
  let level: Sentry.SeverityLevel = "error";
  let tags: Record<string, string> = {};
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let shouldReport = true;

  if (error instanceof ErrorApp) {
    statusCode = error.statusCode;

    // Set severity based on status code
    if (statusCode >= 500) {
      level = "error";
      tags.errorType = "server";
    } else if (statusCode >= 400) {
      level = "warning";
      tags.errorType = "client";
      // Don't report client errors (4xx) to Sentry unless they're auth issues
      shouldReport = error instanceof ErrorAuth || error instanceof ErrorForbidden;
    }

    // Add error classification tags
    if (error instanceof ErrorNotFound) {
      tags.errorClass = "not_found";
    } else if (error instanceof ErrorAuth) {
      tags.errorClass = "authentication";
    } else if (error instanceof ErrorForbidden) {
      tags.errorClass = "authorization";
    } else if (error instanceof ErrorValidation) {
      tags.errorClass = "validation";
    } else if (error instanceof ErrorInvalidRequest) {
      tags.errorClass = "invalid_request";
    } else if (error instanceof ErrorAlreadyExists) {
      tags.errorClass = "conflict";
    } else if (error instanceof ErrorUnknown) {
      tags.errorClass = "unknown";
    }

    // Report to Sentry if it's a server error or critical client error
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

    const errorRes: ErrorServerRes = { message: error.message, success: false };
    if (!!error.errors) {
      errorRes.errors = error.errors;
    }
    return NextResponse.json(errorRes, { status: error.statusCode });
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    captureException(error, {
      level: "error",
      tags: { errorType: "server", errorClass: "unhandled" },
      extra: {
        errorName: error.name,
        stack: error.stack,
      },
    });

    return NextResponse.json(
      { message: error.message, success: false },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }

  // Handle unknown error types
  captureException(new Error(`Unknown error type: ${String(error)}`), {
    level: "error",
    tags: { errorType: "server", errorClass: "unknown_type" },
    extra: {
      errorValue: error,
    },
  });

  return NextResponse.json(
    { message: ERROR_MESSAGES.INTERNAL_SERVER, success: false },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
  );
}
