import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
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

// Change from ISR to dynamic rendering since we're fetching from API
export const dynamic = "force-dynamic";

// Generate metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productId = parseProductSlug(slug);

  try {
    const response = await fetch(
      `${
        process.env.SITE_URL || "http://localhost:3000"
      }/api/products/${productId}`
    );
    if (!response.ok) {
      return createMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        canonical: "/products",
        noIndex: true,
      });
    }

    const data = await response.json();
    const product = data.product;

    if (!product) {
      return createMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        canonical: "/products",
        noIndex: true,
      });
    }

    // Transform to match current Product interface for metadata
    const transformedProduct = {
      id: product.id,
      name: product.name,
      category: mapCategoryToUI(product.category),
      description: product.description || "",
      inci: product.botanicalName || product.name,
      applications:
        product.variants?.[0]?.usage || "Various cosmetic applications",
    };

    const categoryLabel = mapCategoryToUILabel(transformedProduct.category);

    return createMetadata({
      title: `${product.name} | ${categoryLabel}`,
      description: `${
        product.description || "High-quality natural cosmetic ingredient"
      }. INCI: ${transformedProduct.inci}. ${transformedProduct.applications}`,
      canonical: `/products/${slug}`,
      keywords: [
        product.name.toLowerCase(),
        "cosmetic ingredient",
        "natural ingredient",
        transformedProduct.category.replace("-", " "),
        "B2B supplier",
      ],
      image: product.variants?.[0]?.images?.[0]?.url || "/og-image-default.jpg",
    });
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return createMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      canonical: "/products",
      noIndex: true,
    });
  }
}

// Helper functions
function mapCategoryToUI(category: string): string {
  const categoryMap: Record<string, string> = {
    ESSENTIAL_OIL: "essential-oil",
    FIXED_OIL: "fixed-oil",
    EXTRACT: "extract",
    HYDROSOL: "hydrosol",
    HERBAL_OILS: "herbal-oils",
    CHEMICALS: "chemicals",
  };
  return categoryMap[category] || category.toLowerCase().replace("_", "-");
}

function mapCategoryToUILabel(category: string): string {
  const labelMap: Record<string, string> = {
    "essential-oil": "Essential Oil",
    "fixed-oil": "Carrier Oil",
    extract: "Extract",
    hydrosol: "Hydrosol",
    "herbal-oils": "Herbal Oil",
    chemicals: "Chemical",
  };
  return labelMap[category] || "Product";
}

// Page component
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productId = parseProductSlug(slug);

  try {
    const response = await fetch(
      `${
        process.env.SITE_URL || "http://localhost:3000"
      }/api/products/${productId}`
    );
    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    const apiProduct = data.product;

    if (!apiProduct) {
      notFound();
    }

    // Transform API product to match current Product interface
    const product = {
      id: apiProduct.id,
      name: apiProduct.name,
      category: mapCategoryToUI(apiProduct.category),
      description: apiProduct.description || "",
      inci: apiProduct.botanicalName || apiProduct.name,
      applications:
        apiProduct.variants?.[0]?.usage || "Various cosmetic applications",
    };

    const categoryLabel = mapCategoryToUILabel(product.category);

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
          products={[]} // TODO: Fetch related products from API
          currentProduct={product}
          categoryLabel={categoryLabel}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
