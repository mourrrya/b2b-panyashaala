import "next/server";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

declare module "next/server" {
  interface NextRequest {
    auth?: {
      user: AuthUser;
    };
  }
}
