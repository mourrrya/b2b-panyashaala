import NextAuth from "next-auth";
import { authConfig } from "./config";

/**
 * Auth.js exports for server-side usage (API routes, Server Components)
 * DO NOT import this in Edge runtime (middleware) - use config.edge.ts instead
 */
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
