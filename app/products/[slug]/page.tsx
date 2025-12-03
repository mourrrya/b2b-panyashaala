import { getProductsData } from "@/lib/productData";
import {
  createBreadcrumbSchema,
  createMetadata,
  createProductSchema,
  generateProductSlug,
  JsonLd,
  parseProductSlug,
} from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
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

      {/* Breadcrumb Navigation */}
      <section className="bg-white/80 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            {breadcrumbItems.map((item, index) => (
              <div key={item.path} className="flex items-center gap-2">
                <Link
                  href={item.path}
                  className="text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  {item.name}
                </Link>
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-slate-400">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-100 mb-4">
                {categoryLabel}
              </span>
              <h1 className="text-4xl font-semibold text-slate-900 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Specifications
              </h2>
              <dl className="space-y-6">
                <div>
                  <dt className="font-semibold text-slate-900 mb-2">
                    INCI Name
                  </dt>
                  <dd className="text-slate-600 font-mono text-sm bg-slate-50 p-3 rounded border border-slate-200">
                    {product.inci}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 mb-2">
                    Category
                  </dt>
                  <dd className="text-slate-600">{categoryLabel}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 mb-2">
                    Applications
                  </dt>
                  <dd className="text-slate-600">{product.applications}</dd>
                </div>
              </dl>
            </div>

            {/* Description Detail */}
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                About This Product
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {product.description} This product is designed for professional
                use in cosmetic formulations. With INCI designation{" "}
                <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                  {product.inci}
                </code>
                , it complies with international cosmetic ingredient standards.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Common applications include:{" "}
                {product.applications.toLowerCase()}. Our product comes with
                full traceability, documentation, and technical support for your
                formulation needs.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Product Card */}
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8 shadow-lg">
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-2">Product ID</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    #{product.id}
                  </p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-2">Availability</p>
                  <p className="text-emerald-700 font-semibold">In Stock</p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="block w-full px-6 py-3 rounded-lg bg-emerald-700 text-white font-semibold text-center shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
                  >
                    Request Quote
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full px-6 py-3 rounded-lg border border-emerald-700 text-emerald-800 font-semibold text-center hover:bg-emerald-50 transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Certifications
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>Cosmetic-grade verified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>GC/MS testing available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>ISO & GMP aligned</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>Full traceability</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Other {categoryLabel}s
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products
              .filter(
                (p) => p.category === product.category && p.id !== product.id
              )
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${generateProductSlug(
                    relatedProduct.name,
                    relatedProduct.id
                  )}`}
                  className="group p-6 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-100/50 bg-white hover:bg-emerald-50/30"
                >
                  <p className="text-xs font-semibold text-emerald-600 mb-2">
                    {categoryLabel}
                  </p>
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {relatedProduct.description}
                  </p>
                  <p className="text-xs text-emerald-600 font-mono mt-4">
                    {relatedProduct.inci}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
