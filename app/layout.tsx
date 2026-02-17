import { AuthProvider } from "@/components/AuthProvider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Sonner } from "@/components/sonner";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  DEFAULT_OG_IMAGE,
  JsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    default: "Nature-powered actives for modern cosmetic formulations | B2B Supplier",
    template: "%s | " + SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Aukra",
    "Aukra Chem Essentials",
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
    "cosmetic raw materials",
    "wholesale essential oils",
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
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-797272461"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-797272461');
            `,
        }}
      />
      <body suppressHydrationWarning className={`${plusJakarta.className} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ClientOnly>
          <ProgressBar>
            <AuthProvider>
              <Header />
              <div id="main-content">{children}</div>
            </AuthProvider>
            <Footer />
          </ProgressBar>
          <Sonner />
        </ClientOnly>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
