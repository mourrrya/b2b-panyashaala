import { createServerSupabaseClient } from "@/lib/supabase";
import type { AuthError, SupabaseClient, User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

interface RequestAuthResult {
  supabase: SupabaseClient;
  user: User | null;
  error: AuthError | null;
}

const BEARER_PREFIX = "bearer";

export function extractAccessToken(headerValue: string | null): string | null {
  if (!headerValue) {
    return null;
  }

  const [scheme, ...rest] = headerValue.trim().split(" ");
  if ((scheme ?? "").toLowerCase() !== BEARER_PREFIX) {
    return null;
  }

  const token = rest.join(" ").trim();
  return token.length > 0 ? token : null;
}

export async function getRequestAuth(request: NextRequest): Promise<RequestAuthResult> {
  const supabase = createServerSupabaseClient();
  const accessToken = extractAccessToken(request.headers.get("authorization"));

  const {
    data: { user },
    error,
  } = accessToken ? await supabase.auth.getUser(accessToken) : await supabase.auth.getUser();

  return { supabase, user, error };
}
