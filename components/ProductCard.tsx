import { generateProductSlug } from "@/lib/seo";
import type { Product } from "@/lib/store";
import { Check } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  basket: number[];
  addToBasket: (id: number) => void;
  removeFromBasket: (id: number) => void;
}

export function ProductCard({
  product,
  basket,
  addToBasket,
  removeFromBasket,
}: ProductCardProps) {
  const categories = [
    { value: "essential-oil", label: "Essential Oils" },
    { value: "fixed-oil", label: "Fixed/Carrier Oils" },
    { value: "extract", label: "Plant Extracts" },
    { value: "hydrosol", label: "Hydrosols" },
  ];

  const isInBasket = basket.includes(product.id);

  return (
    <Link
      href={`/products/${generateProductSlug(product.name, product.id)}`}
      className="p-6 rounded-2xl border border-slate-100 bg-white card-hover cursor-pointer transition-all hover:border-emerald-200 hover:shadow-lg flex flex-col"
    >
      <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 pt-6 pb-3 bg-white rounded-t-2xl flex items-start justify-between gap-1 mb-3">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
          {categories.find((c) => c.value === product.category)?.label}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{product.description}</p>
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          <span className="font-medium">INCI:</span> {product.inci}
        </p>
        <p className="text-xs text-emerald-700 font-medium">
          <span className="block text-slate-600 font-normal">
            Applications:
          </span>
          {product.applications}
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
        className={`mt-4 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
          isInBasket
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
        }`}
      >
        {isInBasket ? (
          <>
            <Check className="inline w-4 h-4 mr-1" />
            Added to Enquiry
          </>
        ) : (
          "Add to Enquiry"
        )}
      </button>
    </Link>
  );
}
