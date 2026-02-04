import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { NextResponse } from "next/server";

export interface ErrorResponse {
  success: false;
  message: string;
  details?: any; // For validation errors
}

export class ErrorApp extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.BAD_REQUEST,
    public details?: any,
  ) {
    super(message);
  }
}

export class ErrorNotFound extends ErrorApp {
  constructor(message?: string) {
    super(message || ERROR_MESSAGES.RESOURCE.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
}

export class ErrorAuth extends ErrorApp {
  constructor(message?: string) {
    super(
      message || ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }
}

export class ErrorForbidden extends ErrorApp {
  constructor(message?: string) {
    super(message || ERROR_MESSAGES.RESOURCE.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }
}

export class ErrorAlreadyExists extends ErrorApp {
  constructor(message: string) {
    super(`${message}`, HTTP_STATUS.CONFLICT);
  }
}

export class ErrorValidation extends ErrorApp {
  constructor(message?: string, details?: any) {
    super(
      message || ERROR_MESSAGES.VALIDATION.VALIDATION_FAILED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}

export class ErrorInvalidRequest extends ErrorApp {
  constructor(message?: string, details?: any) {
    super(
      message || ERROR_MESSAGES.VALIDATION.INVALID_REQUEST,
      HTTP_STATUS.BAD_REQUEST,
      details,
    );
  }
}

// unknown error handler
export class ErrorUnknown extends ErrorApp {
  constructor(message?: string) {
    super(message || ERROR_MESSAGES.UNKNOWN, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof ErrorApp) {
    const errorRes: any = { message: error.message };
    if (!!error.details) {
      errorRes.details = error.details;
    }
    return NextResponse.json(errorRes, { status: error.statusCode });
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }

  return NextResponse.json(
    { message: ERROR_MESSAGES.INTERNAL_SERVER, success: false },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
  );
}
