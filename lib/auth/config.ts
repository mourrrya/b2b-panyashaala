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
        console.log("[AUTH AUTHORIZE] Starting authorization", {
          isSignUp,
          hasEmail: !!(credentials?.email && typeof credentials.email === "string"),
          hasPassword: !!(credentials?.password && typeof credentials.password === "string"),
          hasName: !!(credentials?.name && typeof credentials.name === "string"),
          emailLength:
            credentials?.email && typeof credentials.email === "string"
              ? credentials.email.length
              : 0,
          passwordLength:
            credentials?.password && typeof credentials.password === "string"
              ? credentials.password.length
              : 0,
          nameLength:
            credentials?.name && typeof credentials.name === "string" ? credentials.name.length : 0,
          timestamp: new Date().toISOString(),
        });

        // Validate input
        const schema = isSignUp ? signUpSchema : credentialsSchema;
        const parsed = schema.safeParse(credentials);

        if (!parsed.success) {
          const firstError = parsed.error.issues[0];
          console.log("[AUTH AUTHORIZE] Validation failed", {
            isSignUp,
            errorMessage: firstError?.message,
            errorPath: firstError?.path,
            allErrors: parsed.error.issues.map((issue) => ({
              message: issue.message,
              path: issue.path,
            })),
            timestamp: new Date().toISOString(),
          });
          throw new Error(firstError?.message || "Invalid input");
        }

        const { email, password } = parsed.data;

        console.log("[AUTH AUTHORIZE] Validation passed, checking database", {
          isSignUp,
          email: email.toLowerCase(),
          emailLength: email.length,
          passwordLength: password.length,
          timestamp: new Date().toISOString(),
        });

        // Find existing user
        const existingUser = await prisma.customer.findUnique({
          where: { email: email.toLowerCase() },
          include: { accounts: true },
        });

        console.log("[AUTH AUTHORIZE] Database lookup result", {
          isSignUp,
          email: email.toLowerCase(),
          userFound: !!existingUser,
          userId: existingUser?.id ? existingUser.id.substring(0, 8) + "..." : null,
          hasPassword: !!existingUser?.password,
          accountCount: existingUser?.accounts?.length || 0,
          accountProviders: existingUser?.accounts?.map((acc) => acc.provider) || [],
          timestamp: new Date().toISOString(),
        });

        if (isSignUp) {
          // SIGN UP FLOW
          console.log("[AUTH AUTHORIZE] Starting sign up flow", {
            email: email.toLowerCase(),
            userExists: !!existingUser,
            hasAccounts: (existingUser?.accounts?.length || 0) > 0,
            hasPassword: !!existingUser?.password,
            timestamp: new Date().toISOString(),
          });

          if (existingUser) {
            // Check if user has OAuth account but no password (allow setting password)
            if (existingUser.accounts.length > 0 && !existingUser.password) {
              console.log("[AUTH AUTHORIZE] OAuth user without password - allowing password set", {
                userId: existingUser.id.substring(0, 8) + "...",
                accountProviders: existingUser.accounts.map((acc) => acc.provider),
                timestamp: new Date().toISOString(),
              });

              // User exists with OAuth, let them set a password
              const hashedPassword = await bcrypt.hash(password, 12);
              const updatedUser = await prisma.customer.update({
                where: { id: existingUser.id },
                data: {
                  password: hashedPassword,
                  fullName: existingUser.fullName || (parsed.data as any).name,
                },
              });

              console.log("[AUTH AUTHORIZE] Password set for OAuth user", {
                userId: updatedUser.id.substring(0, 8) + "...",
                email: updatedUser.email,
                hasName: !!updatedUser.fullName,
                nameLength: updatedUser.fullName?.length || 0,
                timestamp: new Date().toISOString(),
              });

              return {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.fullName,
                image: updatedUser.avatarUrl,
              };
            }
            // User exists with password - can't sign up again
            console.log("[AUTH AUTHORIZE] Sign up blocked - user already exists with password", {
              email: email.toLowerCase(),
              timestamp: new Date().toISOString(),
            });
            throw new Error("An account with this email already exists. Please sign in.");
          }

          console.log("[AUTH AUTHORIZE] Creating new user", {
            email: email.toLowerCase(),
            hasName: !!(parsed.data as any).name,
            nameLength: (parsed.data as any).name?.length || 0,
            timestamp: new Date().toISOString(),
          });

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

          console.log("[AUTH AUTHORIZE] New user created successfully", {
            userId: newUser.id.substring(0, 8) + "...",
            email: newUser.email,
            hasName: !!newUser.fullName,
            nameLength: newUser.fullName?.length || 0,
            emailVerified: !!newUser.emailVerified,
            timestamp: new Date().toISOString(),
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.fullName,
            image: newUser.avatarUrl,
          };
        } else {
          // SIGN IN FLOW
          console.log("[AUTH AUTHORIZE] Starting sign in flow", {
            email: email.toLowerCase(),
            userExists: !!existingUser,
            hasPassword: !!existingUser?.password,
            hasAccounts: (existingUser?.accounts?.length || 0) > 0,
            accountProviders: existingUser?.accounts?.map((acc) => acc.provider) || [],
            timestamp: new Date().toISOString(),
          });

          if (!existingUser) {
            console.log("[AUTH AUTHORIZE] Sign in failed - user not found", {
              email: email.toLowerCase(),
              timestamp: new Date().toISOString(),
            });
            throw new Error("No account found with this email. Please sign up first.");
          }

          // Check if user has no password (OAuth only user)
          if (!existingUser.password) {
            console.log("[AUTH AUTHORIZE] User has no password", {
              userId: existingUser.id.substring(0, 8) + "...",
              hasAccounts: (existingUser.accounts?.length || 0) > 0,
              accountProviders: existingUser.accounts?.map((acc) => acc.provider) || [],
              timestamp: new Date().toISOString(),
            });

            // Check if they have an OAuth account
            if (existingUser.accounts.length > 0) {
              const providers = existingUser.accounts.map((a) => a.provider).join(", ");
              console.log("[AUTH AUTHORIZE] OAuth user trying password login", {
                userId: existingUser.id.substring(0, 8) + "...",
                providers,
                timestamp: new Date().toISOString(),
              });
              throw new Error(
                `This account uses ${providers} login. Please sign in with ${providers} or set a password.`,
              );
            }
            console.log("[AUTH AUTHORIZE] No password and no OAuth accounts", {
              userId: existingUser.id.substring(0, 8) + "...",
              timestamp: new Date().toISOString(),
            });
            throw new Error("Please set a password for your account.");
          }

          // Verify password
          console.log("[AUTH AUTHORIZE] Verifying password", {
            userId: existingUser.id.substring(0, 8) + "...",
            email: existingUser.email,
            passwordLength: password.length,
            storedPasswordLength: existingUser.password.length,
            timestamp: new Date().toISOString(),
          });

          const isValidPassword = await bcrypt.compare(password, existingUser.password);
          if (!isValidPassword) {
            console.log("[AUTH AUTHORIZE] Password verification failed", {
              userId: existingUser.id.substring(0, 8) + "...",
              email: existingUser.email,
              timestamp: new Date().toISOString(),
            });
            throw new Error("Invalid password. Please try again.");
          }

          console.log("[AUTH AUTHORIZE] Sign in successful", {
            userId: existingUser.id.substring(0, 8) + "...",
            email: existingUser.email,
            hasName: !!existingUser.fullName,
            nameLength: existingUser.fullName?.length || 0,
            hasImage: !!existingUser.avatarUrl,
            imageLength: existingUser.avatarUrl?.length || 0,
            timestamp: new Date().toISOString(),
          });

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
      console.log("[AUTH SIGNIN] Starting sign in callback", {
        provider: account?.provider,
        hasUser: !!user,
        userId: user?.id ? user.id.substring(0, 8) + "..." : null,
        userEmail: user?.email,
        hasAccount: !!account,
        accountType: account?.type,
        hasProfile: !!profile,
        profileName: profile?.name,
        timestamp: new Date().toISOString(),
      });

      // For OAuth providers, handle account linking
      if (account?.provider === "google" && user.email) {
        console.log("[AUTH SIGNIN] Processing Google OAuth", {
          email: user.email.toLowerCase(),
          accountId: account.providerAccountId,
          timestamp: new Date().toISOString(),
        });

        try {
          const existingUser = await prisma.customer.findUnique({
            where: { email: user.email.toLowerCase() },
            include: { accounts: true },
          });

          console.log("[AUTH SIGNIN] Google OAuth - database lookup", {
            email: user.email.toLowerCase(),
            userFound: !!existingUser,
            existingUserId: existingUser?.id ? existingUser.id.substring(0, 8) + "..." : null,
            hasAccounts: (existingUser?.accounts?.length || 0) > 0,
            accountProviders: existingUser?.accounts?.map((acc) => acc.provider) || [],
            timestamp: new Date().toISOString(),
          });

          if (existingUser) {
            // Check if Google account is already linked
            const hasGoogleAccount = existingUser.accounts.some((acc) => acc.provider === "google");

            console.log("[AUTH SIGNIN] Google OAuth - existing user check", {
              userId: existingUser.id.substring(0, 8) + "...",
              hasGoogleAccount,
              accountCount: existingUser.accounts.length,
              timestamp: new Date().toISOString(),
            });

            if (!hasGoogleAccount) {
              console.log("[AUTH SIGNIN] Google OAuth - linking account", {
                userId: existingUser.id.substring(0, 8) + "...",
                providerAccountId: account.providerAccountId,
                timestamp: new Date().toISOString(),
              });

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

              console.log("[AUTH SIGNIN] Google OAuth - account linked and profile updated", {
                userId: existingUser.id.substring(0, 8) + "...",
                nameUpdated: !existingUser.fullName && !!profile?.name,
                avatarUpdated: !existingUser.avatarUrl && !!(profile as any)?.picture,
                timestamp: new Date().toISOString(),
              });
            }

            // Use existing user's ID
            user.id = existingUser.id;
            console.log("[AUTH SIGNIN] Google OAuth - using existing user ID", {
              userId: existingUser.id.substring(0, 8) + "...",
              timestamp: new Date().toISOString(),
            });
          } else {
            console.log("[AUTH SIGNIN] Google OAuth - creating new user", {
              email: user.email.toLowerCase(),
              name: profile?.name,
              hasPicture: !!(profile as any)?.picture,
              pictureLength: (profile as any)?.picture?.length || 0,
              timestamp: new Date().toISOString(),
            });

            // Create new user for Google OAuth
            const newUser = await prisma.customer.create({
              data: {
                email: user.email.toLowerCase(),
                fullName: profile?.name || user.name,
                avatarUrl: (profile as any)?.picture || user.image,
                emailVerified: new Date(),
              },
            });

            console.log("[AUTH SIGNIN] Google OAuth - new user created", {
              userId: newUser.id.substring(0, 8) + "...",
              email: newUser.email,
              hasName: !!newUser.fullName,
              hasAvatar: !!newUser.avatarUrl,
              timestamp: new Date().toISOString(),
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

            console.log("[AUTH SIGNIN] Google OAuth - account link created", {
              userId: newUser.id.substring(0, 8) + "...",
              providerAccountId: account.providerAccountId,
              timestamp: new Date().toISOString(),
            });

            user.id = newUser.id;
          }

          console.log("[AUTH SIGNIN] Google OAuth - sign in successful", {
            userId: user.id?.substring(0, 8) + "...",
            email: user.email,
            timestamp: new Date().toISOString(),
          });
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

      console.log("[AUTH SIGNIN] Sign in callback completed", {
        provider: account?.provider,
        success: true,
        userId: user?.id?.substring(0, 8) + "...",
        timestamp: new Date().toISOString(),
      });
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      console.log("[AUTH JWT] JWT callback called", {
        hasToken: !!token,
        tokenId: token?.id ? (token.id as string).substring(0, 8) + "..." : null,
        tokenEmail: token?.email,
        hasUser: !!user,
        userId: user?.id ? user.id.substring(0, 8) + "..." : null,
        userEmail: user?.email,
        hasAccount: !!account,
        accountProvider: account?.provider,
        trigger,
        hasSession: !!session,
        sessionUserName: session?.user?.name,
        timestamp: new Date().toISOString(),
      });

      // Initial sign in
      if (user) {
        console.log("[AUTH JWT] Setting initial token data from user", {
          userId: user.id.substring(0, 8) + "...",
          userEmail: user.email,
          userName: user.name,
          userImageLength: user.image?.length || 0,
          timestamp: new Date().toISOString(),
        });

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        console.log("[AUTH JWT] Updating token from session", {
          trigger,
          sessionUserName: session.user?.name,
          sessionUserImageLength: session.user?.image?.length || 0,
          currentTokenName: token.name,
          currentTokenPictureLength: (token.picture as string)?.length || 0,
          timestamp: new Date().toISOString(),
        });

        token.name = session.user?.name || token.name;
        token.picture = session.user?.image || token.picture;
      }

      console.log("[AUTH JWT] JWT callback completed", {
        finalTokenId: token.id ? (token.id as string).substring(0, 8) + "..." : null,
        finalTokenEmail: token.email,
        finalTokenName: token.name,
        finalTokenPictureLength: (token.picture as string)?.length || 0,
        timestamp: new Date().toISOString(),
      });

      return token;
    },
    async session({ session, token }) {
      console.log("[AUTH SESSION] Session callback called", {
        hasSession: !!session,
        sessionUserId: session?.user?.id ? session.user.id.substring(0, 8) + "..." : null,
        sessionUserEmail: session?.user?.email,
        sessionUserName: session?.user?.name,
        sessionUserImageLength: session?.user?.image?.length || 0,
        hasToken: !!token,
        tokenId: token?.id ? (token.id as string).substring(0, 8) + "..." : null,
        tokenEmail: token?.email,
        tokenName: token?.name,
        tokenPictureLength: (token?.picture as string)?.length || 0,
        timestamp: new Date().toISOString(),
      });

      if (token && session.user) {
        console.log("[AUTH SESSION] Updating session from token", {
          tokenId: (token.id as string).substring(0, 8) + "...",
          tokenEmail: token.email,
          tokenName: token.name,
          tokenPictureLength: (token.picture as string)?.length || 0,
          timestamp: new Date().toISOString(),
        });

        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      console.log("[AUTH SESSION] Session callback completed", {
        finalSessionUserId: session.user?.id ? session.user.id.substring(0, 8) + "..." : null,
        finalSessionUserEmail: session.user?.email,
        finalSessionUserName: session.user?.name,
        finalSessionUserImageLength: session.user?.image?.length || 0,
        timestamp: new Date().toISOString(),
      });

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
