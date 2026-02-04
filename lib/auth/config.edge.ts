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

      // Protected routes that require authentication
      const protectedRoutes = AUTH_CONFIG.PROTECTED_ROUTES;
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      // Auth routes that should redirect if already logged in
      const authRoutes = AUTH_CONFIG.AUTH_ROUTES;
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isProtectedRoute) {
        if (!isLoggedIn) {
          // Redirect to login with callback URL
          return false;
        }
        return true;
      }

      if (isAuthRoute && isLoggedIn) {
        // Redirect authenticated users away from auth pages
        return Response.redirect(new URL("/", nextUrl));
      }

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
