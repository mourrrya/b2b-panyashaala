import type { Product } from "@/store/store";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        About This Product
      </h2>
      <p className="text-slate-600 leading-relaxed mb-4">
        {product.description} This product is designed for professional use in
        cosmetic formulations. With INCI designation{" "}
        <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
          {product.inci}
        </code>
        , it complies with international cosmetic ingredient standards.
      </p>
      <p className="text-slate-600 leading-relaxed">
        Common applications include: {product.applications.toLowerCase()}. Our
        product comes with full traceability, documentation, and technical
        support for your formulation needs.
      </p>
    </div>
  );
}
