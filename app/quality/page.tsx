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
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">
            Quality & Sourcing
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-10">
            Quality-first supply with transparent documentation
          </h1>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-3">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">FAQ</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="accordion-item rounded-2xl border border-slate-100 bg-white overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === idx ? null : idx)
                    }
                    className="w-full text-left px-6 py-4 font-semibold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    {faq.question}
                    <svg
                      className={`w-5 h-5 transition-transform ${
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
                    <div className="px-6 py-4 bg-slate-50 text-sm text-slate-600 border-t border-slate-100">
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
