import { generateApplications, generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImages } from "@/types/product";

interface ProductSpecificationsProps {
  product: ProductWithVariantsImages;
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
          <div className="text-slate-600 flex flex-wrap gap-2">
            {generateApplications(product).map((item) => (
              <span
                className="font-medium capitalize border border-slate-200 bg-slate-100 px-1.5 py-0.5 rounded text-xs sm:text-sm text-slate-700 inline-block"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </dl>
    </div>
  );
}
