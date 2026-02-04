import type { Product } from "@/store/store";

interface ProductHeaderProps {
  product: Product;
  categoryLabel: string;
}

export function ProductHeader({ product, categoryLabel }: ProductHeaderProps) {
  return (
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
  );
}
