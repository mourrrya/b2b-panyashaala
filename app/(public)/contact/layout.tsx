import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | Get in Touch with Our Sourcing Team",
  description:
    "Contact our cosmetic ingredients sourcing team for product inquiries, custom solutions, and technical support. We respond within 24 hours.",
  canonical: "/contact",
  keywords: [
    "contact",
    "inquiry",
    "sourcing team",
    "technical support",
    "custom solutions",
    "B2B",
  ],
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
