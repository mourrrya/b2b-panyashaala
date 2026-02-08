import { auth } from "@/lib/auth";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

type ProtectedHandler<TParams = Record<string, string>> = (
  req: NextRequest & { auth: { user: AuthUser } },
  context: RouteContext<TParams>,
) => Promise<NextResponse>;

/**
 * Protect an API route with Auth.js authentication
 * Automatically returns 401 if user is not authenticated
 */
export function protect<TParams = Record<string, string>>(handler: ProtectedHandler<TParams>) {
  return async (req: NextRequest, context: RouteContext<TParams>): Promise<NextResponse> => {
    try {
      const session = await auth();

      if (!session?.user?.id || !session?.user?.email) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.AUTH.UNAUTHORIZED, success: false },
          { status: HTTP_STATUS.UNAUTHORIZED },
        );
      }

      // Attach user to request for convenience
      const protectedReq = req as NextRequest & { auth: { user: AuthUser } };
      protectedReq.auth = {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      };

      return handler(protectedReq, context);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.AUTH.AUTHENTICATION_ERROR, success: false },
        { status: HTTP_STATUS.UNAUTHORIZED },
      );
    }
  };
}

// Export ProtectedRequest type for use in route handlers
export type ProtectedRequest = NextRequest & { auth: { user: AuthUser } };

/**
 * Get the current authenticated user (for use in server components/actions)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return null;
    }
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  } catch {
    return null;
  }
}

/**
 * Check if request is authenticated (for use in middleware/API routes)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
