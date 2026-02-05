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
import { UI_LABELS } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
  JsonLd,
} from "@/lib/seo";
import { ProductWithVariantsImagesReviews } from "@/types/api.payload.types";

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
    // FIXME : need to fetch product data using swr
    const product = await getProductById(productId.toString());
    const categoryLabel = product.category
      .toLocaleLowerCase()
      .split("_")
      .join(" ");
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
      title: PAGE_SEO.PRODUCT_NOT_FOUND.title,
      description: PAGE_SEO.PRODUCT_NOT_FOUND.description,
      canonical: PAGE_SEO.PRODUCT_NOT_FOUND.canonical,
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
  const productDb: ProductWithVariantsImagesReviews = await getProductById(
    productId.toString(),
  );
  const allProductsDb = await getProducts({});

  console.log("Fetched product from DB:", productDb);

  const categoryLabel = productDb.category.split("_").join(" ");

  const breadcrumbItems = [
    { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
    { name: UI_LABELS.BREADCRUMBS.PRODUCTS, path: "/products" },
    { name: productDb.name, path: `/products/${productDb.id}` },
  ];

  return (
    <main className="bg-texture min-h-screen">
      <JsonLd schema={createProductSchema(productDb)} />
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />

      <BreadcrumbNavigation items={breadcrumbItems} />

      {/* Product Header */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <ProductHeader product={productDb} categoryLabel={categoryLabel} />

            <ProductSpecifications
              product={productDb}
              categoryLabel={categoryLabel}
            />

            <ProductDescription product={productDb} />
          </div>

          <ProductSidebar product={productDb} />
        </div>
      </section>

      <RelatedProducts
        products={allProductsDb}
        currentProduct={productDb}
        categoryLabel={categoryLabel}
      />
    </main>
  );
}
