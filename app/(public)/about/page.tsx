import {
  APPROACH_STEPS,
  FEATURE_HIGHLIGHTS,
  MARKETING_COPY,
  UI_LABELS,
} from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.ABOUT.title,
  description: PAGE_SEO.ABOUT.description,
  canonical: PAGE_SEO.ABOUT.canonical,
  keywords: [...PAGE_SEO.ABOUT.keywords],
});

const breadcrumbItems = [
  { name: UI_LABELS.BREADCRUMBS.HOME, path: "/" },
  { name: UI_LABELS.BREADCRUMBS.ABOUT, path: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbItems)} />
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2 sm:mb-3">
                {UI_LABELS.SECTIONS.ABOUT_US}
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4">
                {UI_LABELS.HEADERS.ABOUT_TITLE}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                {MARKETING_COPY.ABOUT_INTRO}
              </p>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
                {MARKETING_COPY.ABOUT_SUPPORT}
              </p>
              <Link
                href="/contact"
                className="text-sm sm:text-base text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                {UI_LABELS.ACTIONS.TALK_TO_TEAM}
              </Link>
            </div>
            <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-100 p-5 sm:p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                {UI_LABELS.SECTIONS.OUR_APPROACH}
              </h3>
              <ol className="space-y-4 sm:space-y-6">
                {APPROACH_STEPS.map((item, idx) => (
                  <li key={idx}>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm sm:text-base font-semibold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center">
            {FEATURE_HIGHLIGHTS.ABOUT_PAGE.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 lg:p-6 bg-white/95 rounded-xl sm:rounded-2xl border border-slate-100 card-hover"
              >
                <p className="text-xs sm:text-sm text-slate-500">
                  {item.label}
                </p>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
