import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "About Us | Professional Cosmetic Ingredients Supplier",
  description:
    "Learn about our B2B cosmetic ingredients supply network, quality standards, and commitment to supporting formulators and manufacturers with certified botanical products.",
  canonical: "/about",
  keywords: [
    "about us",
    "B2B supplier",
    "cosmetic ingredients",
    "quality standards",
    "ISO certified",
    "GMP aligned",
    "sourcing network",
    "botanical products",
  ],
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
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
                About Us
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4">
                Professionally set-up supplier for cosmetic innovators
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                We are a newly launched yet deeply networked B2B supplier
                dedicated to the cosmetic and personal care industry. Our
                sourcing partners span certified distillers, seed crushers, and
                botanical processors with strict cosmetic-grade controls.
              </p>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
                From boutique clean labels to enterprise-scale contract
                manufacturers, we support your formulation journey with
                documentation, traceability, and responsive collaboration.
              </p>
              <Link
                href="/contact"
                className="text-sm sm:text-base text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                Talk to our sourcing team →
              </Link>
            </div>
            <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-100 p-5 sm:p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                Our Approach
              </h3>
              <ol className="space-y-4 sm:space-y-6">
                {[
                  {
                    title: "Sourcing",
                    description:
                      "Partnering with trusted growers, distillers, and extraction houses.",
                  },
                  {
                    title: "Quality & Testing",
                    description:
                      "GC/MS, microbiology, and stability checks aligned with cosmetic specs.",
                  },
                  {
                    title: "Customization & Support",
                    description:
                      "Documentation packets, format customization, and formulation insights.",
                  },
                  {
                    title: "On-time Supply",
                    description:
                      "Optimized logistics and inventory planning for global shipments.",
                  },
                ].map((item, idx) => (
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
            {[
              { label: "ISO Certified", value: "Ready" },
              { label: "GMP", value: "Aligned" },
              { label: "FSSAI", value: "Compliance" },
              { label: "MSDS / COA", value: "Available" },
            ].map((item, idx) => (
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
