import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: "Login",
  description: "Sign in to your Aukra Chem Essentials account.",
  canonical: "/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
