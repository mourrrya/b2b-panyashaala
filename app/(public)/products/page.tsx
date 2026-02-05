import { ProductsApiProvider } from "@/lib/client/providers/ProductsApiProvider";
import { UI_LABELS } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.PRODUCTS.title,
  description: PAGE_SEO.PRODUCTS.description,
  canonical: PAGE_SEO.PRODUCTS.canonical,
  keywords: [...PAGE_SEO.PRODUCTS.keywords],
});

const breadcrumbItems = [
  { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
  { name: UI_LABELS.BREADCRUMBS.PRODUCTS, path: "/products" },
];

export default function ProductsPage() {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />
      <ProductsApiProvider>
        <ProductsClient />
      </ProductsApiProvider>
    </>
  );
}
