"use client";

import { UI_LABELS } from "@/lib/constants";
import { generateINCI } from "@/lib/productUtils";
import { ProductWithVariantsImages } from "@/types/product";
import { Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BasketDrawerProps {
  basketProducts: ProductWithVariantsImages[];
  basketLength: number;
  removeFromBasket: (productId: number | string) => void;
  setBasketDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
}

function BasketItemSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="pr-8">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </Card>
  );
}

export function Basket({
  basketProducts,
  basketLength,
  removeFromBasket,
  setBasketDrawerOpen,
  isLoading = false,
}: BasketDrawerProps) {
  if (basketLength === 0) {
    return (
      <div className="basket-empty h-full flex flex-col items-center justify-center py-8 gap-2 px-6">
        <Package className="w-12 h-12 text-emerald-300 mb-4" />
        <p className="text-center text-slate-600 font-medium mb-2">
          {UI_LABELS.BASKET.EMPTY_TITLE}
        </p>
        <p className="text-center text-sm text-slate-500 mb-6">{UI_LABELS.BASKET.EMPTY_SUBTITLE}</p>
        <Link href="/products">
          <Button
            className="bg-emerald-800 hover:bg-emerald-700 text-white"
            onClick={() => setBasketDrawerOpen(false)}
          >
            {UI_LABELS.ACTIONS.BROWSE_PRODUCTS}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100dvh-76px)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: basketLength }).map((_, i) => <BasketItemSkeleton key={i} />)
            : basketProducts.map((product, index) => (
                <div key={product.id}>
                  <Card
                    className="basket-card p-4"
                    style={{
                      animation: `fadeIn 600ms ease-out ${index * 100}ms both`,
                    }}
                  >
                    <div className="relative">
                      <button
                        onClick={() => removeFromBasket(product.id)}
                        className="basket-card-remove absolute top-0 right-0 p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={`Remove ${product.name}`}
                        aria-label={`Remove ${product.name} from basket`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-8">
                        <h3 className="text-lg font-semibold capitalize text-emerald-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm capitalize text-slate-600 mb-2">
                          {product.category.toLocaleLowerCase().split("_").join(" ")}
                        </p>
                        <p className="text-xs text-slate-500 capitalize italic font-mono">
                          {generateINCI(product)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
        </div>
      </div>

      <div className="border-t border-slate-100 p-4 space-y-3">
        <Link href="/contact" className="w-full block">
          <Button
            size="lg"
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold"
            disabled={basketLength === 0 || isLoading}
            onClick={() => setBasketDrawerOpen(false)}
          >
            {UI_LABELS.ACTIONS.SEND_ENQUIRY}
          </Button>
        </Link>
      </div>
    </div>
  );
}
