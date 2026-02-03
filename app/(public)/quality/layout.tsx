import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: "Quality Standards | ISO & GMP Certified Ingredients",
  description:
    "Our quality assurance process includes GC/MS testing, microbiology checks, and cosmetic-grade certifications. ISO and GMP aligned for reliable supply.",
  canonical: "/quality",
  keywords: [
    "quality",
    "ISO certified",
    "GMP",
    "testing",
    "certifications",
    "quality assurance",
    "compliance",
  ],
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Quality", path: "/quality" },
];

export default function QualityLayout({
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
