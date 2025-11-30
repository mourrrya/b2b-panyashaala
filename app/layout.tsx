import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type React from "react";
import ClientOnly from "./ClientOnly";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

// <CHANGE> Updated metadata for cosmetic supplier business
export const metadata: Metadata = {
  title: "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
  description:
    "Natural cosmetic ingredients supplier offering essential oils, carrier oils, botanical extracts, and hydrosols for formulators and manufacturers.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} antialiased`}>
        <ClientOnly>
          <Header />
          <AntdRegistry>{children}</AntdRegistry>
          <Footer />
        </ClientOnly>
        <Analytics />
      </body>
    </html>
  );
}
