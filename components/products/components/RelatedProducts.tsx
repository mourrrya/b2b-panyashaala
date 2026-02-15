import { generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImages } from "@/types/product";
import Link from "next/link";

interface RelatedProductsProps {
  products: ProductWithVariantsImages[];
  currentProduct: ProductWithVariantsImages;
  categoryLabel: string;
}

export function RelatedProducts({ products, currentProduct, categoryLabel }: RelatedProductsProps) {
  const relatedProducts = products
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 3);
  if (!relatedProducts || relatedProducts.length === 0) return null;
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">Other {categoryLabel}s</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
              className="group p-6 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-100/50 bg-white hover:bg-emerald-50/30"
            >
              <p className="text-xs font-semibold text-emerald-600 mb-2">{categoryLabel}</p>
              <h3 className="capitalize font-semibold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                {relatedProduct.name}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">{relatedProduct.description}</p>
              <p className="capitalize text-xs text-emerald-600 font-mono mt-4">
                {generateINCI(relatedProduct)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
