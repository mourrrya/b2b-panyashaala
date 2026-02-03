import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = createMetadata({
  title: "Product Catalog | Natural Cosmetic Ingredients",
  description:
    "Browse our complete range of essential oils, carrier oils, botanical extracts, and hydrosols for cosmetic formulations. 400+ products with INCI names and applications.",
  canonical: "/products",
  keywords: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "hydrosols",
    "product catalog",
    "cosmetic supplier",
    "ingredient sourcing",
  ],
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
];

export default function ProductsPage() {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />
      <ProductsClient />
    </>
  );
}
