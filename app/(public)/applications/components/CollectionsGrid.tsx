"use client";

import { CollectionListItem } from "@/app/api/services/collectionServices";
import { CollectionCard } from "./CollectionCard";

interface CollectionsGridProps {
  collections: CollectionListItem[];
}

export function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
