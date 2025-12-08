"use client";

import type { Product } from "@/lib/store";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface BasketDrawerProps {
  basketProducts: Product[];
  basketLength: number;
  removeFromBasket: (productId: number) => void;
  setBasketDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export function BasketDrawer({
  basketProducts,
  basketLength,
  removeFromBasket,
  setBasketDrawerOpen,
}: BasketDrawerProps) {
  if (basketLength === 0) {
    return (
      <div className="basket-empty h-full flex flex-col items-center justify-center py-8 gap-2">
        <InboxOutlined className="text-4xl text-emerald-300 mb-4" />
        <p className="text-center text-slate-600 font-medium mb-2">
          Your enquiry basket is empty
        </p>
        <p className="text-center text-sm text-slate-500 mb-6">
          Add products to get started with your enquiry
        </p>
        <Link href="/products">
          <Button
            type="primary"
            className="bg-emerald-800 hover:bg-emerald-700"
            onClick={() => setBasketDrawerOpen(false)}
          >
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {basketProducts.map((product, index) => (
            <div key={product.id}>
              <Card
                className="basket-card"
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
                    <DeleteOutlined className="text-lg" />
                  </button>

                  <div className="pr-8">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {product.category
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
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

      <div className="border-t border-slate-100 p-4 space-y-3 ">
        <Link href="/contact" className="w-full block">
          <Button
            type="primary"
            size="large"
            block
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold"
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
