"use client";

import { FAQ_DATA, QUALITY_FEATURES, UI_LABELS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function QualityPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2">
            {UI_LABELS.SECTIONS.QUALITY_SOURCING}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-6 sm:mb-8 lg:mb-10">
            {UI_LABELS.HEADERS.QUALITY_TITLE}
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {QUALITY_FEATURES.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 gradient-card card-hover"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3">{item.description}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">
              {UI_LABELS.SECTIONS.FAQ}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {FAQ_DATA.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl sm:rounded-2xl border border-slate-100 bg-white/95 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-slate-900 flex justify-between items-center hover:bg-slate-50/80 transition-colors"
                  >
                    {faq.question}
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-2 transition-transform duration-300 ease-out ${
                        openAccordion === idx ? "rotate-180" : ""
                      }`}
                    />
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
