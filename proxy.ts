import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NAVIGATION_CONFIG, PUBLIC_NAV } from "./lib/constants/navigation";

// Routes that require authentication
const protectedPages = NAVIGATION_CONFIG.PROTECTED;

// Routes that are only accessible when NOT authenticated
const authPages = NAVIGATION_CONFIG.AUTH_ONLY;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token
  // On Vercel (HTTPS), NextAuth v5 uses __Secure- prefixed cookies
  // We must tell getToken() to look for the correct cookie name
  const isSecure = request.nextUrl.protocol === "https:";
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  });

  const isLoggedIn = !!token;

  // Check if user is trying to access protected routes
  const isProtectedPages = protectedPages.some((route) => pathname.startsWith(route));

  // Check if user is trying to access auth routes (login, etc.)
  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedPages && !isLoggedIn) {
    const loginUrl = new URL(PUBLIC_NAV.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthPage && isLoggedIn) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || PUBLIC_NAV.HOME;
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api|.*\\..*$).*)",
  ],
};
