import { PRODUCT_CATEGORY_LABELS, UI_LABELS } from "@/lib/constants";
import { generateApplications, generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImages } from "@/types/product";
import { useRouter } from "@bprogress/next/app";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: ProductWithVariantsImages;
  basket: (number | string)[];
  showApplications?: boolean;
  addToBasket: (id: number | string) => void;
  removeFromBasket: (id: number | string) => void;
}

export function ProductCard({
  product,
  basket,
  addToBasket,
  removeFromBasket,
  showApplications = true,
}: ProductCardProps) {
  const isInBasket = basket.includes(product.id);
  const router = useRouter();

  return (
    <div
      className="p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-white card-hover transition-all hover:border-emerald-200 hover:shadow-lg flex flex-col cursor-pointer"
      onClick={(e) => router.push(`/products/${product.id}`)}
    >
      <div className="bg-white rounded-t-xl sm:rounded-t-2xl flex items-start justify-between gap-1 mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2 capitalize">
          {product.name}
        </h3>
        <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap shrink-0">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-3">
        {product.description}
      </p>
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-slate-100 mb-2">
        <p className="text-[10px] sm:text-xs text-slate-500 capitalize">
          <span className="font-medium">INCI:</span> {generateINCI(product)}
        </p>
        {showApplications && (
          <p className="text-[10px] sm:text-xs text-emerald-700 font-medium items-start flex gap-1 flex-wrap">
            <span className="block text-slate-600 font-normal">Applications:</span>
            {generateApplications(product).map((item) => (
              <span
                className="font-medium capitalize border border-slate-200 bg-slate-100 px-1 py-px sm:px-1 sm:py-0.5 rounded text-[10px] sm:text-xs text-slate-700 inline-block"
                key={item}
              >
                {item}
              </span>
            ))}
          </p>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isInBasket) {
            removeFromBasket(product.id);
          } else {
            addToBasket(product.id);
          }
        }}
        className={`mt-4 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
          isInBasket
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
        }`}
      >
        {isInBasket ? (
          <>
            <Check className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
            {UI_LABELS.ACTIONS.ADDED_TO_ENQUIRY}
          </>
        ) : (
          UI_LABELS.ACTIONS.ADD_TO_ENQUIRY
        )}
      </button>
    </div>
  );
}
