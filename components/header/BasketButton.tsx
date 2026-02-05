"use client";

import { UI_LABELS } from "@/lib/constants";
import { useProductStore } from "@/store/productStore";
import { ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Basket } from "../BasketDrawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface BasketButtonProps {
  basketProducts?: any[];
  basketLength?: number;
}

export function BasketButton() {
  const [basketDrawerOpen, setBasketDrawerOpen] = useState(false);
  const { basket, products, removeFromBasketOptimistic } = useProductStore();

  const basketProducts = useMemo(
    () => products.filter((product) => basket.includes(product.id)),
    [products, basket],
  );

  return (
    <Sheet open={basketDrawerOpen} onOpenChange={setBasketDrawerOpen}>
      <SheetTrigger asChild>
        <button
          className="relative cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 text-emerald-800 hover:text-emerald-700 transition-colors group focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          title={`${UI_LABELS.BASKET.VIEW_BASKET_TITLE} with ${basket.length} items`}
          aria-label={UI_LABELS.NAV.OPEN_BASKET}
        >
          <ShoppingBag className="w-6 h-6" />
          {basket.length > 0 && (
            <span
              className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-pulse"
              aria-label={`${basket.length} ${UI_LABELS.BASKET.ITEMS_IN_BASKET}`}
            >
              {basket.length}
            </span>
          )}
          <span className="hidden sm:inline text-xs sm:text-sm font-medium">
            {UI_LABELS.BASKET.ENQUIRY}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="max-w-85 w-[calc(100%-80px)] min-w-50 p-0"
      >
        <SheetHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
          <SheetTitle className="text-lg font-semibold text-emerald-900">
            {UI_LABELS.BASKET.ENQUIRY_BASKET} ({basket.length})
          </SheetTitle>
        </SheetHeader>
        <Basket
          basketProducts={basketProducts}
          basketLength={basket.length}
          removeFromBasket={removeFromBasketOptimistic}
          setBasketDrawerOpen={setBasketDrawerOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
