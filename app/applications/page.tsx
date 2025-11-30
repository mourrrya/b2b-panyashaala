"use client";

import { useState } from "react";

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const contactNumber = "+91 8076450898";

  const applications = [
    {
      title: "Hair Care & Scalp Health",
      description:
        "Professional formulations for hair growth, conditioning, and scalp treatments.",
      ingredients:
        "Bhringraj Extract, Fenugreek, Saw Palmetto, Onion Oil, Argan Oil, Tea Tree, Rosemary Hydrosol, Cedarwood Oil, Black Seed Oil, Rice Water.",
    },
    {
      title: "Skin Care & Anti-Aging",
      description:
        "Premium serums, creams, and treatments for visible skin transformation.",
      ingredients:
        "Rose Hydrosol, Licorice Extract, Jojoba Oil, Lavender Oil, Ginseng Extract, Pomegranate Seed Oil, Green Tea Extract, Frankincense Oil, Gotu Kola, Neroli Oil.",
    },
    {
      title: "Body Care & Wellness",
      description:
        "Luxurious lotions, body butters, soaps, and holistic care products.",
      ingredients:
        "Coconut Oil, Neem Extract, Orange Oil, Shea carrier blends, Moringa Oil, Turmeric Extract, Arnica Extract, Seabuckthorn Oil, Sweet Almond Oil.",
    },
    {
      title: "Ayurvedic & Herbal",
      description:
        "Classical Ayurvedic formulations rooted in centuries of tradition.",
      ingredients:
        "Amla, Ashwagandha, Tulsi, Turmeric, Gotu Kola, Brahmi, Manjistha, Neem, Sesame Oil, Ginger Oil, Moringa, Spirulina.",
    },
    {
      title: "Clean & Conscious Beauty",
      description: "Minimalist formulations with pure, essential actives only.",
      ingredients:
        "Cucumber Hydrosol, Grapeseed Oil, Witch Hazel, Green Tea Extract, Rose Hydrosol, Aloe Vera Extract, Chamomile Hydrosol, Rice Water.",
    },
    {
      title: "Men's Grooming & Scalp",
      description:
        "Specialized products for beard care, shaving, and masculine grooming.",
      ingredients:
        "Cedarwood Oil, Peppermint Oil, Castor Oil, Aloe Vera Extract, Saw Palmetto, Thyme Oil, Black Pepper Oil, Ginger Oil, Witch Hazel Hydrosol.",
    },
    {
      title: "Sensitive & Calming Care",
      description:
        "Gentle formulations for reactive, inflamed, and compromised skin.",
      ingredients:
        "Chamomile Hydrosol, Aloe Vera Extract, Lavender Oil, Gotu Kola Extract, Sweet Almond Oil, Rose Hydrosol, Arnica Extract, Lemon Hydrosol.",
    },
    {
      title: "Acne & Clarity Solutions",
      description:
        "Targeted treatments for breakout-prone and combination skin.",
      ingredients:
        "Tea Tree Oil, Neem Extract, Thyme Oil, Salicylic Willow Bark Extract, Tulsi Extract, Turmeric Extract, Tea Tree Hydrosol, Witch Hazel Hydrosol, Clove Oil.",
    },
    {
      title: "Brightening & Radiance",
      description:
        "Formulations for luminosity, even tone, and glowing complexion.",
      ingredients:
        "Licorice Extract, Amla Extract, Vitamin C (Rose Hip), Turmeric Extract, Papaya Leaf Extract, Lemon Hydrosol, Beetroot Hydrosol, Orange Peel Hydrosol, Pomegranate Extract.",
    },
    {
      title: "Aromatherapy & Wellness",
      description:
        "Mood-enhancing and therapeutic formulations for emotional wellbeing.",
      ingredients:
        "Bergamot Oil, Ylang Ylang Oil, Frankincense Oil, Jasmine Oil, Lavender Oil, Geranium Oil, Peppermint Oil, Eucalyptus Oil, Rose Oil, Neroli Oil.",
    },
    {
      title: "Luxury & Premium Lines",
      description: "High-end formulations using rare and precious botanicals.",
      ingredients:
        "Rose Oil, Frankincense Oil, Neroli Oil, Ylang Ylang Oil, Argan Oil, Macadamia Oil, Pomegranate Seed Oil, Oud, Seabuckthorn Oil, Rose Hip Extract.",
    },
    {
      title: "Oral Care & Dental Health",
      description: "Natural formulations for oral hygiene and gum health.",
      ingredients:
        "Tea Tree Oil, Peppermint Oil, Clove Oil, Neem Extract, Turmeric Extract, Witch Hazel, Cinnamon Oil, Sage Oil, Myrrh Oil.",
    },
  ];

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">
            Applications
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-6">
            Premium ingredient solutions mapped to your product category
          </h1>

          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 mb-12">
            <p className="text-slate-700 font-medium">
              Need help selecting ingredients for your application?
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Contact us for personalized recommendations
            </p>
            <a
              href={`tel:${contactNumber}`}
              className="inline-block mt-4 bg-emerald-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-900 transition-colors"
            >
              Call {contactNumber}
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedApp(selectedApp === idx ? null : idx)}
                className="p-6 bg-white rounded-2xl border border-slate-100 card-hover cursor-pointer transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {app.title}
                </h3>
                <p className="text-sm text-slate-600 mt-3">{app.description}</p>

                {selectedApp === idx && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-emerald-700 font-medium">
                      Key Ingredients:
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      {app.ingredients}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
