import { prisma } from "@/lib/backend/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

// Validation schemas
const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = credentialsSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  isSignUp: z.literal("true"),
});

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking Google to existing credential accounts
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        const isSignUp = credentials?.isSignUp === "true";

        // Debug logs for production

        // Validate input
        const schema = isSignUp ? signUpSchema : credentialsSchema;
        const parsed = schema.safeParse(credentials);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0];

          throw new Error(firstError?.message || "Invalid input");
        }

        const { email, password } = parsed.data;

        // Find existing user
        const existingUser = await prisma.customer.findUnique({
          where: { email: email.toLowerCase() },
          include: { accounts: true },
        });

        if (isSignUp) {
          // SIGN UP FLOW

          if (existingUser) {
            // Check if user has OAuth account but no password (allow setting password)
            if (existingUser.accounts.length > 0 && !existingUser.password) {
              // User exists with OAuth, let them set a password
              const hashedPassword = await bcrypt.hash(password, 12);
              const updatedUser = await prisma.customer.update({
                where: { id: existingUser.id },
                data: {
                  password: hashedPassword,
                  fullName: existingUser.fullName || (parsed.data as any).name,
                },
              });

              return {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.fullName,
                image: updatedUser.avatarUrl,
              };
            }
            // User exists with password - can't sign up again

            throw new Error("An account with this email already exists. Please sign in.");
          }

          // Create new user
          const hashedPassword = await bcrypt.hash(password, 12);
          const newUser = await prisma.customer.create({
            data: {
              email: email.toLowerCase(),
              password: hashedPassword,
              fullName: (parsed.data as any).name || null,
              emailVerified: new Date(), // Mark as verified since they're setting password
            },
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.fullName,
            image: newUser.avatarUrl,
          };
        } else {
          // SIGN IN FLOW

          if (!existingUser) {
            throw new Error("No account found with this email. Please sign up first.");
          }

          // Check if user has no password (OAuth only user)
          if (!existingUser.password) {
            // Check if they have an OAuth account
            if (existingUser.accounts.length > 0) {
              const providers = existingUser.accounts.map((a) => a.provider).join(", ");

              throw new Error(
                `This account uses ${providers} login. Please sign in with ${providers} or set a password.`,
              );
            }

            throw new Error("Please set a password for your account.");
          }

          // Verify password

          const isValidPassword = await bcrypt.compare(password, existingUser.password);
          if (!isValidPassword) {
            throw new Error("Invalid password. Please try again.");
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.fullName,
            image: existingUser.avatarUrl,
          };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, handle account linking
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.customer.findUnique({
            where: { email: user.email.toLowerCase() },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if Google account is already linked
            const hasGoogleAccount = existingUser.accounts.some((acc) => acc.provider === "google");

            if (!hasGoogleAccount) {
              // Link Google account to existing user
              await prisma.customerAccount.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  expiresAt: account.expires_at,
                  tokenType: account.token_type,
                  scope: account.scope,
                  idToken: account.id_token,
                  sessionState: account.session_state as string | null,
                },
              });

              // Update user profile with Google data if missing
              await prisma.customer.update({
                where: { id: existingUser.id },
                data: {
                  fullName: existingUser.fullName || profile?.name,
                  avatarUrl: existingUser.avatarUrl || (profile as any)?.picture,
                  emailVerified: existingUser.emailVerified || new Date(),
                },
              });
            }

            // Use existing user's ID
            user.id = existingUser.id;
          } else {
            // Create new user for Google OAuth
            const newUser = await prisma.customer.create({
              data: {
                email: user.email.toLowerCase(),
                fullName: profile?.name || user.name,
                avatarUrl: (profile as any)?.picture || user.image,
                emailVerified: new Date(),
              },
            });

            // Create the account link
            await prisma.customerAccount.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
                scope: account.scope,
                idToken: account.id_token,
                sessionState: account.session_state as string | null,
              },
            });

            user.id = newUser.id;
          }
        } catch (error) {
          console.error("[AUTH SIGNIN] Google OAuth error:", {
            error: error instanceof Error ? error.message : "Unknown error",
            email: user.email,
            providerAccountId: account?.providerAccountId,
            timestamp: new Date().toISOString(),
          });
          // Return false to deny access on database errors
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.user?.name || token.name;
        token.picture = session.user?.image || token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
};
