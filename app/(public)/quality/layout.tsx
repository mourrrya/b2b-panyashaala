import { UI_LABELS } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.QUALITY.title,
  description: PAGE_SEO.QUALITY.description,
  canonical: PAGE_SEO.QUALITY.canonical,
  keywords: [...PAGE_SEO.QUALITY.keywords],
});

const breadcrumbItems = [
  { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
  { name: UI_LABELS.BREADCRUMBS.QUALITY, path: "/quality" },
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
