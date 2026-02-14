"use client";

import { CollectionListItem } from "@/app/api/services/collectionServices";
import { UI_LABELS } from "@/lib/constants";
import { useRouter } from "@bprogress/next/app";
import { ArrowRight, Package } from "lucide-react";

interface CollectionCardProps {
  collection: CollectionListItem;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/applications/${encodeURIComponent(collection.name)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 bg-white/90 cursor-pointer transition-all duration-300 hover:border-emerald-300 hover:shadow-lg card-hover flex flex-col"
    >
      {/* Icon & Title */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2 capitalize">
            {collection.name}
          </h3>
          <span className="inline-block text-[10px] sm:text-xs text-emerald-700 font-medium mt-1">
            {collection.productCount} {UI_LABELS.APPLICATIONS.PRODUCTS_COUNT}
          </span>
        </div>
      </div>

      {/* Description */}
      {collection.description && (
        <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 line-clamp-3 flex-1 capitalize">
          {collection.description}
        </p>
      )}

      {/* CTA */}
      <div className="pt-3 sm:pt-4 border-t border-slate-100 mt-auto">
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
          {UI_LABELS.APPLICATIONS.VIEW_PRODUCTS}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
}
