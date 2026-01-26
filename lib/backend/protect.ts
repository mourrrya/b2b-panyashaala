import { NextRequest, NextResponse } from "next/server";
import { getRequestAuth } from "./auth";
import { handleError } from "./errorHandler";
import { logger } from "./logger";

export interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

type Handler<TParams = Record<string, string>> = (
  req: NextRequest,
  context: RouteContext<TParams>,
) => Promise<NextResponse>;

export function protect<TParams = Record<string, string>>(
  handler: Handler<TParams>,
) {
  return async (
    req: NextRequest,
    context: RouteContext<TParams>,
  ): Promise<NextResponse> => {
    try {
      logger.info("Protecting route - Authenticating request");
      const { user, error: authError } = await getRequestAuth(req);

      if (authError || !user) {
        logger.warn({ authError }, "Unauthorized access attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      req.auth = { user };

      return handler(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
