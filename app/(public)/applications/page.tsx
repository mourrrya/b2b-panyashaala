"use client";

import {
  CollectionsApiProvider,
  useApiCollections,
} from "@/lib/client/providers/CollectionsApiProvider";
import { UI_LABELS } from "@/lib/constants";
import { useState } from "react";
import { ApplicationHeader } from "./components/ApplicationHeader";
import { CollectionsGrid } from "./components/CollectionsGrid";
import { CollectionsGridSkeleton } from "./components/CollectionsGridSkeleton";
import { NoResults } from "./components/NoResults";

export default function ApplicationsPage() {
  return (
    <CollectionsApiProvider>
      <ApplicationsPageInner />
    </CollectionsApiProvider>
  );
}

function ApplicationsPageInner() {
  const { collections, isLoading, error, refetch } = useApiCollections();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="bg-texture min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <ApplicationHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {isLoading && <CollectionsGridSkeleton />}

        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600 mb-4">{UI_LABELS.APPLICATIONS.ERROR_LOADING}</p>
            <button
              onClick={() => refetch()}
              className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
            >
              {UI_LABELS.APPLICATIONS.RETRY}
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <CollectionsGrid collections={filteredCollections} />
            {filteredCollections.length === 0 && (
              <NoResults onClearSearch={() => setSearchTerm("")} />
            )}
          </>
        )}
      </section>
    </main>
  );
}
