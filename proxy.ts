import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NAVIGATION_CONFIG, PUBLIC_NAV } from "./lib/constants/navigation";

// Routes that require authentication
const protectedPages = NAVIGATION_CONFIG.PROTECTED;

// Routes that are only accessible when NOT authenticated
const authPages = NAVIGATION_CONFIG.AUTH_ONLY;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug logs for dev environment
  console.log("[PROXY] Request received:", {
    pathname,
    url: request.url,
    method: request.method,
    protocol: request.nextUrl.protocol,
    cookies: request.cookies.getAll().map((c) => c.name),
  });

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

  console.log("[PROXY] Auth status:", {
    isLoggedIn,
    token: token ? { sub: token.sub, email: token.email, exp: token.exp } : null,
    navigationConfig: {
      protected: NAVIGATION_CONFIG.PROTECTED,
      authOnly: NAVIGATION_CONFIG.AUTH_ONLY,
    },
    publicNav: {
      login: PUBLIC_NAV.LOGIN,
      home: PUBLIC_NAV.HOME,
    },
  });

  // Check if user is trying to access protected routes
  const isProtectedPages = protectedPages.some((route) => pathname.startsWith(route));

  // Check if user is trying to access auth routes (login, etc.)
  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  console.log("[PROXY] Route analysis:", {
    isProtectedPages,
    isAuthPage,
    protectedPages: protectedPages, // Actual array values
    authPages: authPages, // Actual array values
    pathname,
    routeMatches: {
      protectedMatch: protectedPages.find((route) => pathname.startsWith(route)),
      authMatch: authPages.find((route) => pathname.startsWith(route)),
    },
  });

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedPages && !isLoggedIn) {
    const loginUrl = new URL(PUBLIC_NAV.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    console.log("[PROXY] Redirecting to login:", {
      from: pathname,
      to: loginUrl.toString(),
      redirectParam: pathname,
      loginUrlBase: PUBLIC_NAV.LOGIN,
      fullUrl: request.url,
    });
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthPage && isLoggedIn) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || PUBLIC_NAV.HOME;
    console.log("[PROXY] Redirecting authenticated user:", {
      from: pathname,
      to: redirectTo,
      redirectParam: request.nextUrl.searchParams.get("redirect"),
      defaultHome: PUBLIC_NAV.HOME,
      finalRedirectUrl: new URL(redirectTo, request.url).toString(),
    });
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  console.log("[PROXY] Allowing request to proceed");
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
