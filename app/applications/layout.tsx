import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: "Applications | Cosmetic Formulation Use Cases",
  description:
    "Discover how our natural ingredients are used in skincare, haircare, personal care, and clean beauty formulations. Application guides for formulators.",
  canonical: "/applications",
  keywords: [
    "applications",
    "formulations",
    "skincare",
    "haircare",
    "clean beauty",
    "use cases",
    "cosmetic formulations",
  ],
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Applications", path: "/applications" },
];

export default function ApplicationsLayout({
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
