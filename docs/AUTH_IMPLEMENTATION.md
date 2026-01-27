# Authentication Implementation with Auth.js (NextAuth.js v5)

## Overview

This project uses Auth.js (NextAuth.js v5) for authentication, supporting:

- **Email/Password** credentials-based authentication
- **Google OAuth** social login
- **Seamless account linking** between OAuth and credentials

## Security Features

### Password Security

- Passwords are hashed using bcrypt with a cost factor of 12
- Minimum password length of 8 characters enforced
- Password validation on both client and server side

### Session Management

- JWT-based sessions with 30-day expiry
- Secure HTTP-only cookies
- CSRF protection built-in

### Account Linking Edge Cases

1. **User signs up with credentials, then tries Google OAuth**: Automatically links Google account to existing user
2. **User signs up with Google, then tries credentials**: Allowed to set a password to enable both login methods
3. **User with both methods**: Can use either method to sign in

## File Structure

```
lib/auth/
├── config.ts       # Auth.js configuration with providers and callbacks
├── index.ts        # Auth.js exports (handlers, signIn, signOut, auth)
└── protect.ts      # API route protection utilities

store/
└── auth-store.ts   # Zustand store for client-side auth state

app/
├── api/auth/[...nextauth]/route.ts  # Auth.js API routes
├── login/page.tsx                    # Login/Signup page
└── middleware.ts                     # Route protection middleware

components/
├── AuthProvider.tsx  # SessionProvider wrapper with auth initialization

types/
└── next-auth.d.ts    # Type augmentations for Auth.js
```

## Environment Variables

Required environment variables (add to `.env.local`):

```bash
# Generate with: npx auth secret
AUTH_SECRET=your-secret-here

# Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Authentication Flow

### Sign In (Credentials)

1. User enters email and password
2. Server validates credentials against database
3. If valid, JWT token is created and stored in cookie
4. User is redirected to requested page

### Sign Up (Credentials)

1. User enters name, email, password
2. Server checks if email exists
3. If new user, password is hashed and user created
4. If user exists with OAuth only, password is added to account
5. JWT token created, user redirected

### Google OAuth

1. User clicks "Continue with Google"
2. Redirected to Google for authentication
3. On return, server checks if email exists
4. If exists: links Google account to user
5. If new: creates new user with Google data
6. JWT token created, user redirected

## API Protection

### Protecting API Routes

```typescript
import { protect, ProtectedRequest, RouteContext } from "@/lib/auth/protect";

async function handler(
  request: ProtectedRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { user } = request.auth;
  // user is guaranteed to exist
  return NextResponse.json({ userId: user.id });
}

export const GET = protect(handler);
```

### Getting Current User (Server Components)

```typescript
import { getCurrentUser } from "@/lib/auth/protect";

async function ServerComponent() {
  const user = await getCurrentUser();
  if (!user) return <div>Not authenticated</div>;
  return <div>Hello, {user.name}</div>;
}
```

## Client-Side Usage

### Auth Store

```typescript
import { useAuthStore } from "@/store/auth-store";

function Component() {
  const { user, isLoading, signInWithCredentials, signInWithGoogle, signOut } =
    useAuthStore();

  // Sign in with credentials
  const handleLogin = async () => {
    const result = await signInWithCredentials({
      email: "user@example.com",
      password: "password123",
    });
    if (!result.success) {
      console.error(result.error);
    }
  };

  // Sign in with Google
  const handleGoogleLogin = () => {
    signInWithGoogle("/dashboard");
  };

  // Sign out
  const handleLogout = () => {
    signOut();
  };
}
```

### Selector Hooks

```typescript
import {
  useUser,
  useIsAuthenticated,
  useAuthLoading,
} from "@/store/auth-store";

function Component() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
}
```

## Middleware Protection

Routes can be protected at the middleware level:

```typescript
// middleware.ts
const protectedRoutes = ["/profile", "/dashboard"];
const authRoutes = ["/login"];
```

- **Protected routes**: Require authentication, redirect to login if not authenticated
- **Auth routes**: Redirect to home if already authenticated

## Database Schema

The following models support authentication:

```prisma
model Customer {
  id            String    @id @default(uuid())
  email         String?   @unique
  password      String?   // Hashed password for credentials
  emailVerified DateTime? // Email verification timestamp
  accounts      Account[] // OAuth accounts
  // ... other fields
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // OAuth tokens
  user              Customer @relation(...)
  @@unique([provider, providerAccountId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

## Error Handling

Auth.js error codes are decoded into user-friendly messages:

| Error Code              | Message                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `CredentialsSignin`     | Invalid credentials. Please check your email and password. |
| `OAuthAccountNotLinked` | This email is already associated with another account.     |
| `OAuthSignin`           | Error starting the OAuth sign in process                   |
| `SessionRequired`       | Please sign in to access this page                         |

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google (new user)
- [ ] Sign in with Google (existing credentials user - should link)
- [ ] Set password for Google-only user
- [ ] Sign out
- [ ] Protected route redirects to login when not authenticated
- [ ] Login page redirects when already authenticated
- [ ] Error messages display correctly
- [ ] Session persists across page refreshes
- [ ] Test keyboard navigation
- [ ] Test session persistence on page refresh
