"use client";

import { useState } from "react";
import { ApplicationHeader } from "./components/ApplicationHeader";
import { ApplicationsGrid } from "./components/ApplicationsGrid";
import { NoResults } from "./components/NoResults";
import { applications } from "./data/applications";

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = applications.filter(
    (app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <main className="bg-texture min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <ApplicationHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ApplicationsGrid
          applications={filteredApplications}
          selectedApp={selectedApp}
          onToggleApp={setSelectedApp}
        />

        {filteredApplications.length === 0 && (
          <NoResults onClearSearch={() => setSearchTerm("")} />
        )}
      </section>
    </main>
  );
}
