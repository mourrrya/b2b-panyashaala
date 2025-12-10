import type { Product } from "@/lib/store";
import Link from "next/link";

interface BasketSidebarProps {
  basketProducts: Product[];
  basketLength: number;
  removeFromBasket: (id: number | string) => void;
}

export function BasketSidebar({
  basketProducts,
  basketLength,
  removeFromBasket,
}: BasketSidebarProps) {
  return (
    <div className="bg-white/95 rounded-3xl border border-slate-100 p-6 sticky top-28 h-fit">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Enquiry Basket ({basketLength})
      </h3>
      {basketLength > 0 ? (
        <>
          <ul className="text-sm text-slate-600 space-y-3 mb-6 max-h-64 overflow-y-auto">
            {basketProducts.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0"
              >
                <span className="font-medium text-slate-900">
                  {product.name}
                </span>
                <button
                  onClick={() => removeFromBasket(product.id)}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold text-lg leading-none"
                  title="Remove from basket"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="w-full block px-4 py-3 text-center bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Send Enquiry
          </Link>
        </>
      ) : (
        <p className="text-sm text-slate-500">No products added yet.</p>
      )}
    </div>
  );
}
