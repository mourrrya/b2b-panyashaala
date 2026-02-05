import { PRODUCT_CATEGORIES, UI_LABELS } from "@/lib/constants";
import { generateApplications, generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { Check } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: ProductWithVariantsImagesReviews;
  basket: (number | string)[];
  addToBasket: (id: number | string) => void;
  removeFromBasket: (id: number | string) => void;
}

export function ProductCard({
  product,
  basket,
  addToBasket,
  removeFromBasket,
}: ProductCardProps) {
  const isInBasket = basket.includes(product.id);

  return (
    <Link
      href={`/products/${product.id}`}
      className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-100 bg-white card-hover cursor-pointer transition-all hover:border-emerald-200 hover:shadow-lg flex flex-col"
    >
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-5 lg:-mx-6 -mt-4 sm:-mt-5 lg:-mt-6 px-4 sm:px-5 lg:px-6 pt-4 sm:pt-5 lg:pt-6 pb-2 sm:pb-3 bg-white rounded-t-xl sm:rounded-t-2xl flex items-start justify-between gap-1 mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap shrink-0">
          {
            PRODUCT_CATEGORIES.find(
              (c) => c.value === (product.category as string),
            )?.label
          }
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-3">
        {product.description}
      </p>
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-slate-100 mb-2">
        <p className="text-[10px] sm:text-xs text-slate-500">
          <span className="font-medium">INCI:</span> {generateINCI(product)}
        </p>
        <p className="text-[10px] sm:text-xs text-emerald-700 font-medium">
          <span className="block text-slate-600 font-normal">
            Applications:
          </span>
          {generateApplications(product)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (isInBasket) {
            removeFromBasket(product.id);
          } else {
            addToBasket(product.id);
          }
        }}
        className={`mt-auto w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
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
    </Link>
  );
}
