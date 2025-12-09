import { getProductsData } from "@/lib/productData";
import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
  generateProductSlug,
  JsonLd,
  parseProductSlug,
} from "@/lib/seo";
import {
  ProductDescription,
  ProductHeader,
  ProductSidebar,
  ProductSpecifications,
  RelatedProducts,
} from "@/src/features/products/components";
import { BreadcrumbNavigation } from "@/src/shared/components/navigation/BreadcrumbNavigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600; // ISR: Revalidate every hour

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = getProductsData();
  return products.map((product) => ({
    slug: generateProductSlug(product.name, product.id),
  }));
}

// Generate metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productId = parseProductSlug(slug);
  const products = getProductsData();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return createMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      canonical: "/products",
      noIndex: true,
    });
  }

  const categoryLabel =
    {
      "essential-oil": "Essential Oil",
      "fixed-oil": "Carrier Oil",
      extract: "Extract",
      hydrosol: "Hydrosol",
    }[product.category] || "Product";

  return createMetadata({
    title: `${product.name} | ${categoryLabel}`,
    description: `${product.description} INCI name: ${product.inci}. Common applications: ${product.applications}.`,
    canonical: `/products/${slug}`,
    image: "/og-image-default.jpg",
    type: "website", // Using website instead of product as product type has limitations
    keywords: [
      product.name,
      categoryLabel,
      product.inci,
      ...product.applications.split(",").map((s) => s.trim()),
      "cosmetic ingredients",
      "B2B supplier",
    ],
  });
}

// Page component
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productId = parseProductSlug(slug);
  const products = getProductsData();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  const categoryLabel =
    {
      "essential-oil": "Essential Oil",
      "fixed-oil": "Carrier Oil",
      extract: "Extract",
      hydrosol: "Hydrosol",
    }[product.category] || "Product";

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${slug}` },
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
        products={products}
        currentProduct={product}
        categoryLabel={categoryLabel}
      />
    </main>
  );
}
