"use client";

import { useInitializeAuth } from "@/store/authStore";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useInitializeAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </SessionProvider>
  );
}
