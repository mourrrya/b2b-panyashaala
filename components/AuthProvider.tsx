"use client";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initialize();
    };
    init();
  }, []);

  return <>{children}</>;
}
