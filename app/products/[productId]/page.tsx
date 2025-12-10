import {
  getProductById,
  getProducts,
} from "@/app/api/services/productServices";
import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
  JsonLd,
} from "@/lib/seo";
import type { Product } from "@/lib/store";
import {
  ProductDescription,
  ProductHeader,
  ProductSidebar,
  ProductSpecifications,
  RelatedProducts,
} from "@/src/features/products/components";
import { BreadcrumbNavigation } from "@/src/shared/components/navigation/BreadcrumbNavigation";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: Revalidate every hour

// Helper functions for data transformation
const mapCategoryToUI = (category: string): string => {
  const categoryMap: Record<string, string> = {
    ESSENTIAL_OIL: "essential-oil",
    FIXED_OIL: "fixed-oil",
    EXTRACT: "extract",
    HYDROSOL: "hydrosol",
    HERBAL_OILS: "herbal-oils",
    CHEMICALS: "chemicals",
  };
  return categoryMap[category] || category.toLowerCase().replace("_", "-");
};

const generateINCI = (product: any): string => {
  if (product.botanicalName) {
    return product.botanicalName;
  }
  // Fallback to name if no botanical name
  return product.name;
};

const generateApplications = (product: any): string => {
  if (product.variants && product.variants.length > 0) {
    const applications = product.variants
      .map((variant: any) => variant.usage || variant.description || "")
      .filter((app: string) => app.length > 0)
      .join(", ");
    return applications || "Various cosmetic applications";
  }
  return "Various cosmetic applications";
};

const transformDbProductToProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  category: mapCategoryToUI(dbProduct.category),
  description: dbProduct.description || "",
  inci: generateINCI(dbProduct),
  applications: generateApplications(dbProduct),
  variants: dbProduct.variants,
  botanicalName: dbProduct.botanicalName,
  supplier: dbProduct.supplier,
  certifications: dbProduct.certifications,
  storageConditions: dbProduct.storageConditions,
});

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
      {
        "essential-oil": "Essential Oil",
        "fixed-oil": "Carrier Oil",
        extract: "Extract",
        hydrosol: "Hydrosol",
      }[product.category] || "Product";

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
        ...product.applications.split(",").map((s) => s.trim()),
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
    {
      "essential-oil": "Essential Oil",
      "fixed-oil": "Carrier Oil",
      extract: "Extract",
      hydrosol: "Hydrosol",
    }[product.category] || "Product";

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.name}` },
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
