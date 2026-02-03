import { AuthProvider } from "@/components/AuthProvider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductDataProvider } from "@/components/ProductDataProvider";
import { Sonner } from "@/components/sonner";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  DEFAULT_OG_IMAGE,
  JsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  VERIFICATION_TOKENS,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type React from "react";
import ClientOnly from "./ClientOnly";
import "./globals.css";
import { ProgressBar } from "./progressBar";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

// Comprehensive metadata export following Next.js 16 Metadata API
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
    template: "%s | " + SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "hydrosols",
    "B2B supplier",
    "natural ingredients",
    "cosmetic formulations",
    "contract manufacturer",
    "ingredient sourcing",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Nature-powered actives for modern cosmetic formulations",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cosmeticsupply",
    creator: "@cosmeticsupply",
    title: "Nature-powered actives for modern cosmetic formulations",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
  category: "business",
  verification: {
    google: VERIFICATION_TOKENS.googleSiteVerification,
    other: {
      "msvalidate.01": VERIFICATION_TOKENS.bingMsvalidate,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd schema={createOrganizationSchema()} />
        <JsonLd schema={createWebsiteSchema()} />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.className} antialiased`}
      >
        <ClientOnly>
          <AuthProvider>
            <ProductDataProvider />
            <Header />
            <ProgressBar>{children}</ProgressBar>
          </AuthProvider>
          <Footer />
          <Sonner />
        </ClientOnly>
        <Analytics />
      </body>
    </html>
  );
}
