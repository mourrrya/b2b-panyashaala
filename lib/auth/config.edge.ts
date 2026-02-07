import { AUTH_CONFIG } from "@/lib/constants";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js configuration
 * This file contains only the configuration that can run in Edge runtime
 * (no Prisma, no bcrypt, no Node.js-only modules)
 */
export const authConfigEdge: NextAuthConfig = {
  pages: {
    signIn: AUTH_CONFIG.PAGES.SIGN_IN,
    error: AUTH_CONFIG.PAGES.ERROR,
  },
  providers: [], // Providers are added in the full config
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Debug logs for dev environment
      console.log("[AUTH EDGE] Authorized callback:", {
        pathname,
        isLoggedIn,
        user: auth?.user ? { id: auth.user.id, email: auth.user.email } : null,
        nextUrl: nextUrl.toString(),
        authConfig: {
          protectedPages: AUTH_CONFIG.PROTECTED_PAGES,
          authPages: AUTH_CONFIG.AUTH_PAGE,
          sessionMaxAge: AUTH_CONFIG.SESSION_MAX_AGE,
          signInPage: AUTH_CONFIG.PAGES.SIGN_IN,
          errorPage: AUTH_CONFIG.PAGES.ERROR,
        },
      });

      // Protected routes that require authentication
      const protectedPages = AUTH_CONFIG.PROTECTED_PAGES;
      const isProtectedPages = protectedPages.some((route) => pathname.startsWith(route));

      // Auth routes that should redirect if already logged in
      const authPages = AUTH_CONFIG.AUTH_PAGE;
      const isAuthPage = authPages.some((route) => pathname.startsWith(route));

      console.log("[AUTH EDGE] Route checks:", {
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

      if (isProtectedPages) {
        if (!isLoggedIn) {
          console.log("[AUTH EDGE] Redirecting to login - protected route accessed without auth");
          // Redirect to login with callback URL
          return false;
        }
        console.log("[AUTH EDGE] Allowing access to protected route");
        return true;
      }

      if (isAuthPage && isLoggedIn) {
        console.log("[AUTH EDGE] Redirecting authenticated user away from auth page");
        // Redirect authenticated users away from auth pages
        return Response.redirect(new URL("/", nextUrl));
      }

      console.log("[AUTH EDGE] Allowing access - no special handling needed");
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};
