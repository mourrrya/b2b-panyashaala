"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToBasket } = useStore();
  const contactNumber = "+91 8076450898";

  const applications = [
    {
      title: "Hair Care & Scalp Health",
      category: "Hair",
      description:
        "Professional formulations for hair growth, conditioning, and scalp treatments.",
      ingredients: [
        "Bhringraj Extract",
        "Fenugreek",
        "Saw Palmetto",
        "Onion Oil",
        "Argan Oil",
        "Tea Tree",
        "Rosemary Hydrosol",
        "Cedarwood Oil",
        "Black Seed Oil",
        "Rice Water",
      ],
      icon: "",
    },
    {
      title: "Skin Care & Anti-Aging",
      category: "Face",
      description:
        "Premium serums, creams, and treatments for visible skin transformation.",
      ingredients: [
        "Rose Hydrosol",
        "Licorice Extract",
        "Jojoba Oil",
        "Lavender Oil",
        "Ginseng Extract",
        "Pomegranate Seed Oil",
        "Green Tea Extract",
        "Frankincense Oil",
        "Gotu Kola",
        "Neroli Oil",
      ],
      icon: "",
    },
    {
      title: "Body Care & Wellness",
      category: "Body",
      description:
        "Luxurious lotions, body butters, soaps, and holistic care products.",
      ingredients: [
        "Coconut Oil",
        "Neem Extract",
        "Orange Oil",
        "Moringa Oil",
        "Turmeric Extract",
        "Arnica Extract",
        "Seabuckthorn Oil",
        "Sweet Almond Oil",
      ],
      icon: "",
    },
    {
      title: "Ayurvedic & Herbal",
      category: "Traditional",
      description:
        "Classical Ayurvedic formulations rooted in centuries of tradition.",
      ingredients: [
        "Amla",
        "Ashwagandha",
        "Tulsi",
        "Turmeric",
        "Gotu Kola",
        "Brahmi",
        "Manjistha",
        "Neem",
        "Sesame Oil",
        "Ginger Oil",
        "Moringa",
        "Spirulina",
      ],
      icon: "",
    },
    {
      title: "Clean & Conscious Beauty",
      category: "Clean",
      description: "Minimalist formulations with pure, essential actives only.",
      ingredients: [
        "Cucumber Hydrosol",
        "Grapeseed Oil",
        "Witch Hazel",
        "Green Tea Extract",
        "Rose Hydrosol",
        "Aloe Vera Extract",
        "Chamomile Hydrosol",
        "Rice Water",
      ],
      icon: "",
    },
    {
      title: "Men''s Grooming & Scalp",
      category: "Men",
      description:
        "Specialized products for beard care, shaving, and masculine grooming.",
      ingredients: [
        "Cedarwood Oil",
        "Peppermint Oil",
        "Castor Oil",
        "Aloe Vera Extract",
        "Saw Palmetto",
        "Thyme Oil",
        "Black Pepper Oil",
        "Ginger Oil",
        "Witch Hazel Hydrosol",
      ],
      icon: "",
    },
    {
      title: "Sensitive & Calming Care",
      category: "Sensitive",
      description:
        "Gentle formulations for reactive, inflamed, and compromised skin.",
      ingredients: [
        "Chamomile Hydrosol",
        "Aloe Vera Extract",
        "Lavender Oil",
        "Gotu Kola Extract",
        "Sweet Almond Oil",
        "Rose Hydrosol",
        "Arnica Extract",
        "Lemon Hydrosol",
      ],
      icon: "",
    },
    {
      title: "Acne & Clarity Solutions",
      category: "Problem",
      description:
        "Targeted treatments for breakout-prone and combination skin.",
      ingredients: [
        "Tea Tree Oil",
        "Neem Extract",
        "Thyme Oil",
        "Salicylic Willow Bark Extract",
        "Tulsi Extract",
        "Turmeric Extract",
        "Tea Tree Hydrosol",
        "Witch Hazel Hydrosol",
        "Clove Oil",
      ],
      icon: "",
    },
    {
      title: "Brightening & Radiance",
      category: "Brightening",
      description:
        "Formulations for luminosity, even tone, and glowing complexion.",
      ingredients: [
        "Licorice Extract",
        "Amla Extract",
        "Vitamin C (Rose Hip)",
        "Turmeric Extract",
        "Papaya Leaf Extract",
        "Lemon Hydrosol",
        "Beetroot Hydrosol",
        "Orange Peel Hydrosol",
        "Pomegranate Extract",
      ],
      icon: "",
    },
    {
      title: "Aromatherapy & Wellness",
      category: "Wellness",
      description:
        "Mood-enhancing and therapeutic formulations for emotional wellbeing.",
      ingredients: [
        "Bergamot Oil",
        "Ylang Ylang Oil",
        "Frankincense Oil",
        "Jasmine Oil",
        "Lavender Oil",
        "Geranium Oil",
        "Peppermint Oil",
        "Eucalyptus Oil",
        "Rose Oil",
        "Neroli Oil",
      ],
      icon: "",
    },
    {
      title: "Luxury & Premium Lines",
      category: "Luxury",
      description: "High-end formulations using rare and precious botanicals.",
      ingredients: [
        "Rose Oil",
        "Frankincense Oil",
        "Neroli Oil",
        "Ylang Ylang Oil",
        "Argan Oil",
        "Macadamia Oil",
        "Pomegranate Seed Oil",
        "Seabuckthorn Oil",
        "Rose Hip Extract",
      ],
      icon: "",
    },
    {
      title: "Oral Care & Dental Health",
      category: "Oral",
      description: "Natural formulations for oral hygiene and gum health.",
      ingredients: [
        "Tea Tree Oil",
        "Peppermint Oil",
        "Clove Oil",
        "Neem Extract",
        "Turmeric Extract",
        "Witch Hazel",
        "Cinnamon Oil",
        "Sage Oil",
        "Myrrh Oil",
      ],
      icon: "",
    },
  ];

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
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-3">
            Applications
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">
            Premium ingredient solutions for your formulations
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Explore our curated ingredient combinations designed for specific
            applications and product categories
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search applications or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white/95"
            />
            <svg
              className="absolute left-5 top-4 w-6 h-6 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Contact Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">
              Need personalized ingredient recommendations?
            </h3>
            <p className="text-emerald-50 mb-6">
              Our sourcing specialists are ready to help you create the perfect
              formulation
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${contactNumber}`}
                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.265 1.215 2.541 2.253 3.579s2.314 1.835 3.579 2.253l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a2 2 0 01-2 2H7a5 5 0 01-5-5V3z" />
                </svg>
                Call {contactNumber}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedApp(selectedApp === idx ? null : idx)}
              className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 self-baseline ${
                selectedApp === idx
                  ? "bg-white/95 border-emerald-500 shadow-xl"
                  : "bg-white/90 border-slate-100 hover:border-emerald-300 card-hover"
              }`}
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-3">
                {app.icon && <span className="text-4xl">{app.icon}</span>}
                <div className="flex-1">
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {app.category}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {app.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4">{app.description}</p>

              {/* Expanded View */}
              {selectedApp === idx && (
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Key Ingredients:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {app.ingredients.map((ingredient, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Added "${ingredient}" to enquiry basket`);
                          }}
                          className="tag-pill"
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(
                        `Added all ${app.ingredients.length} ingredients from "${app.title}" to basket`
                      );
                    }}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Quick Enquiry - All Ingredients
                  </button>
                </div>
              )}

              {/* Unexpanded CTA */}
              {selectedApp !== idx && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-sm text-emerald-600 font-medium">
                    Click to view ingredients{" "}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600 mb-4">
              No applications found matching your search.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
