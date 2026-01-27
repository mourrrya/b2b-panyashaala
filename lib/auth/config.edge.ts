import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js configuration
 * This file contains only the configuration that can run in Edge runtime
 * (no Prisma, no bcrypt, no Node.js-only modules)
 */
export const authConfigEdge: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers are added in the full config
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Protected routes that require authentication
      const protectedRoutes = ["/profile"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      // Auth routes that should redirect if already logged in
      const authRoutes = ["/login"];
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};
