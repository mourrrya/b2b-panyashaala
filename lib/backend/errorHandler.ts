import { NextResponse } from "next/server";

export interface ErrorResponse {
  success: false;
  message: string;
  details?: any; // For validation errors
}

export class ErrorApp extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public details?: any,
  ) {
    super(message);
  }
}

export class ErrorNotFound extends ErrorApp {
  constructor(message?: string) {
    super(message || "Resource not found", 404);
  }
}

export class ErrorAuth extends ErrorApp {
  constructor(message?: string) {
    super(message || "Authentication failed", 401);
  }
}

export class ErrorForbidden extends ErrorApp {
  constructor(message?: string) {
    super(message || "Forbidden", 403);
  }
}

export class ErrorAlreadyExists extends ErrorApp {
  constructor(message: string) {
    super(`${message}`, 409);
  }
}

export class ErrorValidation extends ErrorApp {
  constructor(message?: string, details?: any) {
    super(message || "Validation failed", 422, details);
  }
}

export class ErrorInvalidRequest extends ErrorApp {
  constructor(message?: string, details?: any) {
    super(message || "Invalid request", 400, details);
  }
}

// unknown error handler
export class ErrorUnknown extends ErrorApp {
  constructor(message?: string) {
    super(message || "Unknown error", 500);
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
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Internal server error", success: false },
    { status: 500 },
  );
}
