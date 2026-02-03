import { createMetadata, createWebsiteSchema, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Home",
  description:
    "B2B natural cosmetic ingredients supplier offering essential oils, carrier oils, botanical extracts, and hydrosols. Serving formulators, manufacturers, and sourcing teams globally with quality-tested, certified ingredients.",
  canonical: "/",
  keywords: [
    "cosmetic ingredients",
    "essential oils",
    "carrier oils",
    "botanical extracts",
    "B2B supplier",
    "natural ingredients",
    "ingredient sourcing",
  ],
});

export default function Home() {
  return (
    <main className="bg-texture">
      <JsonLd schema={createWebsiteSchema()} />
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm text-emerald-600 mb-3 sm:mb-4">
            Nature-powered actives for modern cosmetic formulations
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Natural Ingredients for Next-Generation Cosmetics
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
            Essential oils, carrier oils, botanical extracts, and hydrosols
            curated for formulators, manufacturers, and sourcing teams. Bridging
            traditional botanicals with contemporary cosmetic science.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/products"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-emerald-700 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              View Product Range
            </Link>
            <Link
              href="/contact"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-emerald-700 text-emerald-800 text-sm sm:text-base font-semibold hover:bg-emerald-50 transition-colors"
            >
              Send Enquiry
            </Link>
          </div>
          <dl className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-900">Target Customers</dt>
              <dd>
                Cosmetic brands, contract manufacturers, R&D labs, sourcing
                teams.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Supply Focus</dt>
              <dd>Essential oils, fixed oils, extracts, hydrosols.</dd>
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
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">ISO | GMP</p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                  Certification-ready
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">72 hrs</p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                  Sample dispatch
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">Global</p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                  Sourcing network
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm">Formulator</p>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                  Technical support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio Overview */}
      <section className="bg-white py-10 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-600 mb-2 sm:mb-3">
            Product Portfolio
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                Essential Oils
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                Therapeutic-grade oils for active performance and signature
                fragrance.
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-teal-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                Fixed / Carrier Oils
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                Stable oils delivering emolliency, conditioning, and skin
                barrier support.
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-lime-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                Extracts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                Dry, water, and oil-soluble actives for targeted performance.
              </p>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-yellow-50 border border-emerald-100 card-hover">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-900">
                Hydrosols
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2">
                Gentle waters and distillates for toners, mists, and rinse-off
                bases.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                Why Choose Us
              </h2>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600">
                <li>
                  • Quality & Purity tested to cosmetic-grade specifications
                </li>
                <li>• Reliable sourcing with transparent documentation</li>
                <li>• Formulation-aligned technical support</li>
                <li>• Flexible MOQs, tailored packs, on-time dispatch</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                Industries & Applications
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100">
                  Personal Care
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100">
                  Hair Care
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100">
                  Skin Care
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100">
                  Ayurvedic / Herbal
                </span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100">
                  Clean Beauty
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/products"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-emerald-700 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              Explore Full Product Range →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
