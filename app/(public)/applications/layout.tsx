import { UI_LABELS } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.APPLICATIONS.title,
  description: PAGE_SEO.APPLICATIONS.description,
  canonical: PAGE_SEO.APPLICATIONS.canonical,
  keywords: [...PAGE_SEO.APPLICATIONS.keywords],
});

const breadcrumbItems = [
  { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
  { name: UI_LABELS.BREADCRUMBS.APPLICATIONS, path: "/applications" },
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
