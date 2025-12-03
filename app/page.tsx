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
      <section className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-emerald-600 mb-4">
            Nature-powered actives for modern cosmetic formulations
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">
            Natural Ingredients for Next-Generation Cosmetics
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Essential oils, carrier oils, botanical extracts, and hydrosols
            curated for formulators, manufacturers, and sourcing teams. Bridging
            traditional botanicals with contemporary cosmetic science.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              View Product Range
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-emerald-700 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors"
            >
              Send Enquiry
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm text-slate-600">
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-16 w-64 h-64 bg-emerald-100 rounded-full blur-3xl"></div>
          <div className="relative space-y-6">
            <Image
              src="/heroImg.svg"
              alt="Botanical ingredients and natural essences"
              className="rounded-2xl w-full object-cover h-64"
              width={600}
              height={400}
              priority
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500">ISO | GMP</p>
                <p className="text-lg font-semibold text-slate-900">
                  Certification-ready
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500">72 hrs</p>
                <p className="text-lg font-semibold text-slate-900">
                  Sample dispatch
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500">Global</p>
                <p className="text-lg font-semibold text-slate-900">
                  Sourcing network
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500">Formulator</p>
                <p className="text-lg font-semibold text-slate-900">
                  Technical support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio Overview */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-3">
            Product Portfolio
          </p>
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex-1 min-w-[200px] p-6 rounded-2xl bg-emerald-50 border border-emerald-100 card-hover">
              <h3 className="text-lg font-semibold text-emerald-900">
                Essential Oils
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Therapeutic-grade oils for active performance and signature
                fragrance.
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-6 rounded-2xl bg-teal-50 border border-emerald-100 card-hover">
              <h3 className="text-lg font-semibold text-emerald-900">
                Fixed / Carrier Oils
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Stable oils delivering emolliency, conditioning, and skin
                barrier support.
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-6 rounded-2xl bg-lime-50 border border-emerald-100 card-hover">
              <h3 className="text-lg font-semibold text-emerald-900">
                Extracts
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Dry, water, and oil-soluble actives for targeted performance.
              </p>
            </div>
            <div className="flex-1 min-w-[200px] p-6 rounded-2xl bg-yellow-50 border border-emerald-100 card-hover">
              <h3 className="text-lg font-semibold text-emerald-900">
                Hydrosols
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Gentle waters and distillates for toners, mists, and rinse-off
                bases.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Why Choose Us
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li>
                  • Quality & Purity tested to cosmetic-grade specifications
                </li>
                <li>• Reliable sourcing with transparent documentation</li>
                <li>• Formulation-aligned technical support</li>
                <li>• Flexible MOQs, tailored packs, on-time dispatch</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Industries & Applications
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="px-4 py-2 rounded-full bg-slate-100">
                  Personal Care
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100">
                  Hair Care
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100">
                  Skin Care
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100">
                  Ayurvedic / Herbal
                </span>
                <span className="px-4 py-2 rounded-full bg-slate-100">
                  Clean Beauty
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-full bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 transition-colors"
            >
              Explore Full Product Range →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
