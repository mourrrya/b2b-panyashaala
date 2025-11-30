export default function AboutPage() {
  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-3">
                About Us
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 mb-4">
                Professionally set-up supplier for cosmetic innovators
              </h1>
              <p className="text-slate-600 mb-4">
                We are a newly launched yet deeply networked B2B supplier
                dedicated to the cosmetic and personal care industry. Our
                sourcing partners span certified distillers, seed crushers, and
                botanical processors with strict cosmetic-grade controls.
              </p>
              <p className="text-slate-600 mb-8">
                From boutique clean labels to enterprise-scale contract
                manufacturers, we support your formulation journey with
                documentation, traceability, and responsive collaboration.
              </p>
              <a
                href="/contact"
                className="text-emerald-700 font-semibold hover:text-emerald-800"
              >
                Talk to our sourcing team →
              </a>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Our Approach
              </h3>
              <ol className="space-y-6">
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
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "ISO Certified", value: "Ready" },
              { label: "GMP", value: "Aligned" },
              { label: "FSSAI", value: "Compliance" },
              { label: "MSDS / COA", value: "Available" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-100"
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-xl font-semibold text-slate-900">
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
