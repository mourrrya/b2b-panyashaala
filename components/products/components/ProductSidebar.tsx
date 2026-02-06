"use client";
import { useAddToBasket, useBasket, useRemoveFromBasket } from "@/store/productStore";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import { Check } from "lucide-react";
import Link from "next/link";

interface ProductSidebarProps {
  product: ProductWithVariantsImagesReviews;
}

export function ProductSidebar({ product }: ProductSidebarProps) {
  const basket = useBasket();
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();
  const isInBasket = basket.includes(product.id);

  const handleEnquiryToggle = () => {
    if (isInBasket) {
      removeFromBasket(product.id);
    } else {
      addToBasket(product.id);
    }
  };

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-20 space-y-6">
        {/* Product Card */}
        <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8 shadow-lg">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">Product ID</p>
            <p className="text-2xl font-semibold text-slate-900">#{product.id}</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">Availability</p>
            <p className="text-emerald-700 font-semibold">In Stock</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleEnquiryToggle}
              className={`block w-full px-6 py-3 rounded-lg font-semibold text-center shadow-lg transition-colors ${
                isInBasket
                  ? "bg-green-600 text-white shadow-green-700/20 hover:bg-green-700"
                  : "bg-emerald-700 text-white shadow-emerald-700/20 hover:bg-emerald-800"
              }`}
            >
              {isInBasket ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Added to Enquiry
                </span>
              ) : (
                "Add to Enquiry"
              )}
            </button>
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
          <h3 className="font-semibold text-slate-900 mb-4">Certifications</h3>
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
  );
}
