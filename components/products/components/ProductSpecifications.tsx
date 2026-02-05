import { generateApplications, generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImagesReviews } from "@/types/product";

interface ProductSpecificationsProps {
  product: ProductWithVariantsImagesReviews;
  categoryLabel: string;
}

export function ProductSpecifications({ product, categoryLabel }: ProductSpecificationsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Specifications</h2>
      <dl className="space-y-6">
        <div>
          <dt className="font-semibold text-slate-900 mb-2">INCI Name</dt>
          <dd className="text-slate-600 font-mono text-sm bg-slate-50 p-3 rounded border border-slate-200">
            {generateINCI(product)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900 mb-2">Category</dt>
          <dd className="text-slate-600">{categoryLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900 mb-2">Applications</dt>
          <dd className="text-slate-600">{generateApplications(product)}</dd>
        </div>
      </dl>
    </div>
  );
}
