import { UI_LABELS } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.CONTACT.title,
  description: PAGE_SEO.CONTACT.description,
  canonical: PAGE_SEO.CONTACT.canonical,
  keywords: [...PAGE_SEO.CONTACT.keywords],
});

const breadcrumbItems = [
  { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
  { name: UI_LABELS.BREADCRUMBS.CONTACT, path: "/contact" },
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
