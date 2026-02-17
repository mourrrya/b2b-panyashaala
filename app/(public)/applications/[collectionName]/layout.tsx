import { UI_LABELS } from "@/lib/constants";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import type React from "react";

function formatCollectionName(slug: string): string {
  return decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collectionName: string }>;
}): Promise<Metadata> {
  const { collectionName } = await params;
  const displayName = formatCollectionName(collectionName);

  return createMetadata({
    title: `${displayName} | Cosmetic Ingredient Applications`,
    description: `Explore cosmetic ingredients for ${displayName.toLowerCase()} applications. Browse products with INCI names, specifications, and formulation guidance from Aukra Chem Essentials.`,
    canonical: `/applications/${collectionName}`,
    keywords: [
      displayName,
      `${displayName.toLowerCase()} ingredients`,
      "cosmetic applications",
      "formulation ingredients",
      "Aukra",
    ],
  });
}

export default async function CollectionLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ collectionName: string }>;
}>) {
  const { collectionName } = await params;
  const displayName = formatCollectionName(collectionName);

  const breadcrumbItems = [
    { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
    { name: UI_LABELS.BREADCRUMBS.APPLICATIONS, path: "/applications" },
    { name: displayName, path: `/applications/${collectionName}` },
  ];

  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
