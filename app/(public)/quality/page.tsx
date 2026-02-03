"use client";

import { useState } from "react";

export default function QualityPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const faqs = [
    {
      question: "What testing standards do you follow?",
      answer:
        "We conduct GC/MS analysis, microbiology tests (aerobic plate count, pathogens), stability checks, and organoleptic evaluations aligned with ISO 9001 and GMP standards for cosmetic-grade ingredients.",
    },
    {
      question: "Do you provide documentation for compliance?",
      answer:
        "Yes, we supply Certificate of Analysis (COA), MSDS/SDS, INCI declarations, allergen data, IFRA statements, and technical dossiers per shipment.",
    },
    {
      question: "What are your MOQ and lead times?",
      answer:
        "Minimum order quantities vary by product but typically range from 5kg to 25kg. We dispatch samples within 72 hours and bulk orders within 2-4 weeks.",
    },
    {
      question: "Do you support customization?",
      answer:
        "Yes, we offer format customization (pH adjustment, viscosity modification), private labeling, and custom blends tailored to your formulation requirements.",
    },
  ];

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2">
            Quality & Sourcing
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-6 sm:mb-8 lg:mb-10">
            Quality-first supply with transparent documentation
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {[
              {
                title: "Quality First",
                description:
                  "Each lot undergoes organoleptic checks, purity analysis, microbiology, and stability review tailored to cosmetic-grade expectations.",
              },
              {
                title: "Sourcing & Traceability",
                description:
                  "Direct programs with growers and extraction partners ensure farm-level traceability and sustainable harvest practices.",
              },
              {
                title: "Compliance",
                description:
                  "COA, MSDS/SDS, IFRA statements, allergen data, and technical dossiers available per shipment.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 gradient-card card-hover"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">
              FAQ
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="accordion-item rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === idx ? null : idx)
                    }
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-slate-900 flex justify-between items-center hover:bg-slate-50/80 transition-colors"
                  >
                    {faq.question}
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-2 transition-transform ${
                        openAccordion === idx ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>
                  {openAccordion === idx && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-br from-white/95 to-emerald-50/95 text-xs sm:text-sm text-slate-600 border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
