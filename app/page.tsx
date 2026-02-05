import {
  BUSINESS_INFO,
  FEATURE_HIGHLIGHTS,
  MARKETING_COPY,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_DESCRIPTIONS,
  UI_LABELS,
} from "@/lib/constants";
import { PAGE_SEO } from "@/lib/constants/seo";
import { createMetadata, createWebsiteSchema, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: PAGE_SEO.HOME.title,
  description: PAGE_SEO.HOME.description,
  canonical: PAGE_SEO.HOME.canonical,
  keywords: [...PAGE_SEO.HOME.keywords],
});

export default function Home() {
  return (
    <main className="bg-texture">
      <JsonLd schema={createWebsiteSchema()} />
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm text-emerald-600 mb-3 sm:mb-4">
            {MARKETING_COPY.TAGLINE}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 mb-4 sm:mb-6 leading-tight">
            {UI_LABELS.HEADERS.HOME_TITLE}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
            {MARKETING_COPY.HERO_SUBTITLE}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/products"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-emerald-700 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              {UI_LABELS.ACTIONS.VIEW_PRODUCTS}
            </Link>
            <Link
              href="/contact"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-emerald-700 text-emerald-800 text-sm sm:text-base font-semibold hover:bg-emerald-50 transition-colors"
            >
              {UI_LABELS.ACTIONS.SEND_ENQUIRY}
            </Link>
          </div>
          <dl className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-900">
                {UI_LABELS.SECTIONS.TARGET_CUSTOMERS}
              </dt>
              <dd>{BUSINESS_INFO.TARGET_CUSTOMERS}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">
                {UI_LABELS.SECTIONS.SUPPLY_FOCUS}
              </dt>
              <dd>{BUSINESS_INFO.SUPPLY_FOCUS}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-16 w-64 h-64 bg-emerald-100 rounded-full blur-3xl"></div>
          <div className="relative space-y-4 sm:space-y-6">
            <Image
              src="/heroImg.svg"
              alt="Botanical ingredients and natural essences"
              className="rounded-xl sm:rounded-2xl w-full object-cover h-48 sm:h-56 lg:h-64"
              width={600}
              height={400}
              priority
            />
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              {FEATURE_HIGHLIGHTS.HOME_PAGE.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100"
                >
                  <p className="text-slate-500 text-xs sm:text-sm">
                    {feature.label}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                    {feature.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio Overview */}
      <section className="bg-white py-10 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2 sm:mb-3">
            {UI_LABELS.SECTIONS.PRODUCT_PORTFOLIO}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                {PRODUCT_CATEGORIES[0].label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                {PRODUCT_CATEGORY_DESCRIPTIONS.ESSENTIAL_OIL}
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-teal-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                {PRODUCT_CATEGORIES[1].label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                {PRODUCT_CATEGORY_DESCRIPTIONS.FIXED_OIL}
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-lime-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                {PRODUCT_CATEGORIES[2].label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                {PRODUCT_CATEGORY_DESCRIPTIONS.EXTRACT}
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-yellow-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                {PRODUCT_CATEGORIES[3].label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                {PRODUCT_CATEGORY_DESCRIPTIONS.HYDROSOL}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                {UI_LABELS.SECTIONS.WHY_CHOOSE_US}
              </h2>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600">
                {BUSINESS_INFO.WHY_CHOOSE_US.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                {UI_LABELS.SECTIONS.INDUSTRIES_AND_APPLICATIONS}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                {BUSINESS_INFO.INDUSTRIES.map((industry, idx) => (
                  <span
                    key={idx}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/products"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-emerald-700 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              {UI_LABELS.ACTIONS.EXPLORE_PRODUCTS}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
