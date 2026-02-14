"use client";

import { CollectionProductsApiProvider } from "@/lib/client/providers/CollectionsApiProvider";
import { use } from "react";
import { CollectionProductsClient } from "./CollectionProductsClient";

interface CollectionPageProps {
  params: Promise<{ collectionName: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { collectionName } = use(params);
  const decodedName = decodeURIComponent(collectionName);

  return (
    <CollectionProductsApiProvider collectionName={decodedName}>
      <CollectionProductsClient collectionName={decodedName} />
    </CollectionProductsApiProvider>
  );
}
