"use client";

import type { Product } from "@/lib/store";
import { Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BasketDrawerProps {
  basketProducts: Product[];
  basketLength: number;
  removeFromBasket: (productId: number | string) => void;
  setBasketDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export function Basket({
  basketProducts,
  basketLength,
  removeFromBasket,
  setBasketDrawerOpen,
}: BasketDrawerProps) {
  if (basketLength === 0) {
    return (
      <div className="basket-empty h-full flex flex-col items-center justify-center py-8 gap-2 px-6">
        <Package className="w-12 h-12 text-emerald-300 mb-4" />
        <p className="text-center text-slate-600 font-medium mb-2">
          Your enquiry basket is empty
        </p>
        <p className="text-center text-sm text-slate-500 mb-6">
          Add products to get started with your enquiry
        </p>
        <Link href="/products">
          <Button
            className="bg-emerald-800 hover:bg-emerald-700 text-white"
            onClick={() => setBasketDrawerOpen(false)}
          >
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100dvh-76px)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {basketProducts.map((product, index) => (
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
                    <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {product.category
                        .split("-")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </p>
                    <p className="text-xs text-slate-500 italic font-mono">
                      {product.inci}
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
            disabled={basketLength === 0}
            onClick={() => setBasketDrawerOpen(false)}
          >
            Send Enquiry
          </Button>
        </Link>
      </div>
    </div>
  );
}
