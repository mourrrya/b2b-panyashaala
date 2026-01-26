import { User } from "@supabase/supabase-js";
import "next/server";

declare module "next/server" {
  interface NextRequest {
    auth: {
      user: User;
    };
  }
}
