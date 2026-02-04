import {
  getProductById,
  getProducts,
} from "@/app/api/services/productServices";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import {
  ProductDescription,
  ProductHeader,
  ProductSidebar,
  ProductSpecifications,
  RelatedProducts,
} from "@/components/products/components";
import { transformDbProductToProduct } from "@/lib/productUtils";
import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
  JsonLd,
} from "@/lib/seo";

import type { Metadata } from "next";

export const revalidate = 3600; // ISR: Revalidate every hour

// Product transformation helpers are centralized in `lib/productUtils.ts`

// Generate metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  try {
    const productDb = await getProductById(productId.toString());
    const product = transformDbProductToProduct(productDb);

    const categoryLabel =
      (
        {
          "essential-oil": "Essential Oil",
          "fixed-oil": "Carrier Oil",
          extract: "Extract",
          hydrosol: "Hydrosol",
        } as Record<string, string>
      )[product.category] || "Product";
    return createMetadata({
      title: `${product.name} | ${categoryLabel}`,
      description: `${product.description} INCI name: ${product.inci}. Common applications: ${product.applications}.`,
      canonical: `/products/${productId}`,
      image: "/og-image-default.jpg",
      type: "website", // Using website instead of product as product type has limitations
      keywords: [
        product.name,
        categoryLabel,
        product.inci,
        ...product.applications.split(",").map((s: string) => s.trim()),
        "cosmetic ingredients",
        "B2B supplier",
      ],
    });
  } catch (error) {
    return createMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      canonical: "/products",
      noIndex: true,
    });
  }
}

// Page component
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const productDb = await getProductById(productId.toString());
  const product = transformDbProductToProduct(productDb);
  const allProductsDb = await getProducts({});
  const allProducts = allProductsDb.map(transformDbProductToProduct);

  const categoryLabel =
    (
      {
        "essential-oil": "Essential Oil",
        "fixed-oil": "Carrier Oil",
        extract: "Extract",
        hydrosol: "Hydrosol",
      } as Record<string, string>
    )[product.category] || "Product";

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.id}` },
  ];

  return (
    <main className="bg-texture min-h-screen">
      <JsonLd schema={createProductSchema(product)} />
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />

      <BreadcrumbNavigation items={breadcrumbItems} />

      {/* Product Header */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <ProductHeader product={product} categoryLabel={categoryLabel} />

            <ProductSpecifications
              product={product}
              categoryLabel={categoryLabel}
            />

            <ProductDescription product={product} />
          </div>

          <ProductSidebar product={product} />
        </div>
      </section>

      <RelatedProducts
        products={allProducts}
        currentProduct={product}
        categoryLabel={categoryLabel}
      />
    </main>
  );
}
