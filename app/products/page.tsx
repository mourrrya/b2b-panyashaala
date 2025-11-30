"use client";

import { useMemo, useState } from "react";

const products = [
  // Essential Oils
  {
    id: 1,
    name: "Lavender Essential Oil",
    category: "essential-oil",
    description:
      "Premium therapeutic-grade lavender oil for aromatherapy and formulations.",
    inci: "Lavandula angustifolia Oil",
    applications: "Serums, toners, aromatherapy diffusers, bath products",
  },
  {
    id: 2,
    name: "Tea Tree Essential Oil",
    category: "essential-oil",
    description: "Antimicrobial oil for acne and problem skin treatments.",
    inci: "Melaleuca alternifolia Oil",
    applications: "Acne treatments, scalp treatments, body care",
  },
  {
    id: 3,
    name: "Peppermint Essential Oil",
    category: "essential-oil",
    description:
      "Cooling and invigorating oil for skincare and scalp treatments.",
    inci: "Mentha piperita Oil",
    applications: "Cooling masks, scalp treatments, body care, aromatherapy",
  },
  {
    id: 4,
    name: "Citronella Essential Oil",
    category: "essential-oil",
    description: "Fresh, herbaceous oil with insect-repelling properties.",
    inci: "Cymbopogon nardus Oil",
    applications: "Insect-repelling formulations, body care",
  },
  {
    id: 5,
    name: "Jasmine Essential Oil",
    category: "essential-oil",
    description: "Luxurious floral oil for premium skincare and fragrance.",
    inci: "Jasminum sambac Oil",
    applications: "Perfumes, serums, bath products, aromatherapy",
  },
  {
    id: 6,
    name: "Rose Essential Oil",
    category: "essential-oil",
    description: "Precious floral oil for luxury skincare formulations.",
    inci: "Rosa damascena Oil",
    applications: "Anti-aging serums, facial oils, perfumes",
  },
  {
    id: 7,
    name: "Lemon Essential Oil",
    category: "essential-oil",
    description: "Bright citrus oil for cleansing and brightening products.",
    inci: "Citrus limon Oil",
    applications: "Brightening serums, cleansers, aromatherapy",
  },
  {
    id: 8,
    name: "Eucalyptus Essential Oil",
    category: "essential-oil",
    description: "Cooling and clarifying oil for respiratory and skin care.",
    inci: "Eucalyptus globulus Oil",
    applications: "Cooling masks, scalp treatments, body care",
  },
  {
    id: 9,
    name: "Bergamot Essential Oil",
    category: "essential-oil",
    description: "Uplifting citrus oil with mood-boosting properties.",
    inci: "Citrus bergamia Oil",
    applications: "Perfumes, aromatherapy, mood-enhancing products",
  },
  {
    id: 10,
    name: "Rosemary Essential Oil",
    category: "essential-oil",
    description: "Stimulating herb oil for scalp and circulation treatments.",
    inci: "Rosmarinus officinalis Oil",
    applications: "Hair growth serums, scalp treatments, body care",
  },
  {
    id: 11,
    name: "Clove Essential Oil",
    category: "essential-oil",
    description: "Warming spice oil for anti-inflammatory formulations.",
    inci: "Syzygium aromaticum Oil",
    applications: "Anti-acne products, warming masks, aromatherapy",
  },
  {
    id: 12,
    name: "Frankincense Essential Oil",
    category: "essential-oil",
    description: "Precious resin oil for premium anti-aging skincare.",
    inci: "Boswellia sacra Oil",
    applications: "Anti-aging creams, luxury serums, aromatherapy",
  },
  {
    id: 13,
    name: "Cedarwood Essential Oil",
    category: "essential-oil",
    description: "Woodsy oil for scalp health and grooming products.",
    inci: "Cedrus atlantica Oil",
    applications: "Men's grooming, scalp treatments, beard care",
  },
  {
    id: 14,
    name: "Ginger Essential Oil",
    category: "essential-oil",
    description: "Warming spice oil for circulation and pain relief.",
    inci: "Zingiber officinale Oil",
    applications: "Warming masks, body oils, massage blends",
  },
  {
    id: 15,
    name: "Chamomile Essential Oil",
    category: "essential-oil",
    description: "Soothing floral oil for sensitive and calm skincare.",
    inci: "Chamaemelum nobile Oil",
    applications: "Soothing serums, sensitive skin care, bath products",
  },
  {
    id: 16,
    name: "Ylang Ylang Essential Oil",
    category: "essential-oil",
    description: "Exotic floral oil for luxury fragrance and skincare.",
    inci: "Cananga odorata Oil",
    applications: "Perfumes, luxury creams, aromatherapy",
  },
  {
    id: 17,
    name: "Neroli Essential Oil",
    category: "essential-oil",
    description: "Fresh floral oil from orange blossom for premium products.",
    inci: "Citrus aurantium Oil",
    applications: "Premium perfumes, luxury serums, anti-stress products",
  },
  {
    id: 18,
    name: "Geranium Essential Oil",
    category: "essential-oil",
    description: "Balancing floral oil for hormone-conscious skincare.",
    inci: "Pelargonium graveolens Oil",
    applications: "Balancing serums, feminine care, aromatherapy",
  },
  {
    id: 19,
    name: "Thyme Essential Oil",
    category: "essential-oil",
    description: "Antiseptic herb oil for acne and scalp treatments.",
    inci: "Thymus vulgaris Oil",
    applications: "Acne treatments, scalp serums, antimicrobial products",
  },
  {
    id: 20,
    name: "Cinnamon Essential Oil",
    category: "essential-oil",
    description: "Warming spice oil for circulation and warming formulations.",
    inci: "Cinnamomum verum Oil",
    applications: "Warming masks, body care, aromatherapy",
  },

  // Fixed/Carrier Oils
  {
    id: 21,
    name: "Jojoba Carrier Oil",
    category: "fixed-oil",
    description:
      "Lightweight conditioning oil perfect for skincare formulations.",
    inci: "Simmondsia chinensis Oil",
    applications: "Facial oils, serums, massage blends, hair care",
  },
  {
    id: 22,
    name: "Coconut Oil",
    category: "fixed-oil",
    description: "Versatile carrier oil with emollient properties.",
    inci: "Cocos nucifera Oil",
    applications: "Body butters, hair masks, soap bases, bath products",
  },
  {
    id: 23,
    name: "Argan Oil",
    category: "fixed-oil",
    description: "Premium Moroccan oil rich in vitamin E and fatty acids.",
    inci: "Argania spinosa Kernel Oil",
    applications: "Anti-aging serums, hair treatments, body oils",
  },
  {
    id: 24,
    name: "Sweet Almond Oil",
    category: "fixed-oil",
    description: "Nourishing oil for sensitive skin and massage.",
    inci: "Prunus amygdalus dulcis Oil",
    applications: "Baby care, massage oils, facial oils, bath products",
  },
  {
    id: 25,
    name: "Avocado Oil",
    category: "fixed-oil",
    description: "Rich penetrating oil for deep nourishment.",
    inci: "Persea gratissima Oil",
    applications: "Anti-aging creams, mature skin care, body oils",
  },
  {
    id: 26,
    name: "Sunflower Oil",
    category: "fixed-oil",
    description: "Light versatile oil suitable for all skin types.",
    inci: "Helianthus annuus Seed Oil",
    applications: "Facial oils, serums, body care, massage blends",
  },
  {
    id: 27,
    name: "Sesame Oil",
    category: "fixed-oil",
    description: "Warming oil with traditional Ayurvedic benefits.",
    inci: "Sesamum indicum Oil",
    applications: "Ayurvedic massage oils, body care, scalp treatments",
  },
  {
    id: 28,
    name: "Olive Oil",
    category: "fixed-oil",
    description: "Nourishing Mediterranean oil for skincare.",
    inci: "Olea europaea Fruit Oil",
    applications: "Luxury serums, cleansing oils, body care",
  },
  {
    id: 29,
    name: "Castor Oil",
    category: "fixed-oil",
    description: "Rich conditioning oil for hair and lashes.",
    inci: "Ricinus communis Seed Oil",
    applications: "Hair treatments, lash serums, scalp care",
  },
  {
    id: 30,
    name: "Grapeseed Oil",
    category: "fixed-oil",
    description: "Lightweight oil ideal for oily and combination skin.",
    inci: "Vitis vinifera Seed Oil",
    applications: "Facial oils, serums, body care, massage blends",
  },
  {
    id: 31,
    name: "Macadamia Oil",
    category: "fixed-oil",
    description: "Luxurious lightweight oil for premium formulations.",
    inci: "Macadamia ternifolia Seed Oil",
    applications: "Anti-aging serums, luxury facial oils, hair care",
  },
  {
    id: 32,
    name: "Rice Bran Oil",
    category: "fixed-oil",
    description: "Lightweight oil rich in antioxidants.",
    inci: "Oryza sativa Bran Oil",
    applications: "Brightening serums, facial oils, body care",
  },
  {
    id: 33,
    name: "Neem Oil",
    category: "fixed-oil",
    description:
      "Traditional Ayurvedic oil with strong antimicrobial properties.",
    inci: "Azadirachta indica Oil",
    applications: "Acne treatments, scalp care, body care",
  },
  {
    id: 34,
    name: "Wheat Germ Oil",
    category: "fixed-oil",
    description: "Rich oil high in vitamin E for mature skin.",
    inci: "Triticum vulgare Germ Oil",
    applications: "Anti-aging creams, facial oils, body care",
  },
  {
    id: 35,
    name: "Apricot Kernel Oil",
    category: "fixed-oil",
    description: "Light sweet oil suitable for all skin types.",
    inci: "Prunus armeniaca Kernel Oil",
    applications: "Facial oils, serums, baby care, body care",
  },
  {
    id: 36,
    name: "Black Seed Oil",
    category: "fixed-oil",
    description: "Powerful traditional oil with wellness benefits.",
    inci: "Nigella sativa Oil",
    applications: "Wellness formulations, body care, scalp treatments",
  },
  {
    id: 37,
    name: "Walnut Oil",
    category: "fixed-oil",
    description: "Rich oil with omega fatty acids.",
    inci: "Juglans regia Seed Oil",
    applications: "Anti-aging serums, facial oils, body care",
  },
  {
    id: 38,
    name: "Moringa Oil",
    category: "fixed-oil",
    description: "Nutrient-rich traditional oil with antioxidants.",
    inci: "Moringa oleifera Oil",
    applications: "Anti-aging creams, facial serums, body care",
  },
  {
    id: 39,
    name: "Pomegranate Seed Oil",
    category: "fixed-oil",
    description: "Premium oil rich in antioxidants and punicic acid.",
    inci: "Punica granatum Seed Oil",
    applications: "Anti-aging serums, luxury facial oils, body care",
  },
  {
    id: 40,
    name: "Seabuckthorn Oil",
    category: "fixed-oil",
    description: "Precious oil packed with omega fatty acids.",
    inci: "Hippophae rhamnoides Fruit Oil",
    applications: "Anti-aging creams, wound healing, body care",
  },

  // Plant Extracts
  {
    id: 41,
    name: "Aloe Vera Extract",
    category: "extract",
    description: "Soothing and hydrating botanical extract.",
    inci: "Aloe Barbadensis Leaf Extract",
    applications: "Hydrating serums, sensitive skin care, suncare",
  },
  {
    id: 42,
    name: "Neem Extract",
    category: "extract",
    description: "Traditional botanical extract for scalp and body care.",
    inci: "Azadirachta indica Leaf Extract",
    applications: "Anti-dandruff shampoos, scalp treatments, body care",
  },
  {
    id: 43,
    name: "Licorice Extract",
    category: "extract",
    description: "Brightening and soothing botanical extract.",
    inci: "Glycyrrhiza glabra Root Extract",
    applications:
      "Anti-aging serums, brightening creams, sensitive skin products",
  },
  {
    id: 44,
    name: "Ginseng Extract",
    category: "extract",
    description: "Energizing Asian root extract for anti-aging.",
    inci: "Panax ginseng Root Extract",
    applications: "Anti-aging serums, energizing masks, premium creams",
  },
  {
    id: 45,
    name: "Gotu Kola Extract",
    category: "extract",
    description: "Traditional extract for skin elasticity and repair.",
    inci: "Centella asiatica Extract",
    applications: "Firming serums, sensitive skin care, scar treatments",
  },
  {
    id: 46,
    name: "Amla Extract",
    category: "extract",
    description: "Indian gooseberry extract rich in vitamin C.",
    inci: "Phyllanthus emblica Fruit Extract",
    applications: "Brightening serums, hair growth treatments, body care",
  },
  {
    id: 47,
    name: "Ashwagandha Extract",
    category: "extract",
    description: "Adaptogenic herb for stress-relief skincare.",
    inci: "Withania somnifera Root Extract",
    applications: "Stress-relief serums, wellness products, body care",
  },
  {
    id: 48,
    name: "Tulsi Extract",
    category: "extract",
    description: "Sacred herb extract for acne and clarity.",
    inci: "Ocimum sanctum Leaf Extract",
    applications: "Acne treatments, clarifying masks, body care",
  },
  {
    id: 49,
    name: "Turmeric Extract",
    category: "extract",
    description: "Golden spice extract with anti-inflammatory benefits.",
    inci: "Curcuma longa Root Extract",
    applications: "Anti-inflammatory masks, brightening creams, body care",
  },
  {
    id: 50,
    name: "Brahmi Extract",
    category: "extract",
    description: "Traditional Ayurvedic herb for scalp health.",
    inci: "Bacopa monnieri Extract",
    applications: "Scalp treatments, hair growth serums, body care",
  },
  {
    id: 51,
    name: "Arnica Extract",
    category: "extract",
    description: "Mountain herb extract for soothing and healing.",
    inci: "Arnica montana Extract",
    applications: "Soothing serums, body care, massage oils",
  },
  {
    id: 52,
    name: "Witch Hazel Extract",
    category: "extract",
    description: "Astringent extract for pore refinement.",
    inci: "Hamamelis virginiana Extract",
    applications: "Toners, acne treatments, oily skin care",
  },
  {
    id: 53,
    name: "Green Tea Extract",
    category: "extract",
    description: "Antioxidant-rich extract for anti-aging.",
    inci: "Camellia sinensis Leaf Extract",
    applications: "Anti-aging serums, sun protection, body care",
  },
  {
    id: 54,
    name: "Pomegranate Extract",
    category: "extract",
    description: "Antioxidant-rich fruit extract for anti-aging.",
    inci: "Punica granatum Fruit Extract",
    applications: "Anti-aging creams, brightening serums, body care",
  },
  {
    id: 55,
    name: "Spirulina Extract",
    category: "extract",
    description: "Nutrient-dense algae extract for vitality.",
    inci: "Arthrospira platensis Extract",
    applications: "Revitalizing masks, energy-boosting products, body care",
  },
  {
    id: 56,
    name: "Mushroom Extract",
    category: "extract",
    description: "Potent adaptogenic extract for immunity.",
    inci: "Fungal Polysaccharide Extract",
    applications: "Wellness products, immunity-boosting formulations",
  },
  {
    id: 57,
    name: "Stevia Extract",
    category: "extract",
    description: "Natural sweetening agent for formulations.",
    inci: "Stevia rebaudiana Extract",
    applications: "Sweetening formulations, beverages, body care",
  },
  {
    id: 58,
    name: "Manjistha Extract",
    category: "extract",
    description: "Ayurvedic blood purifier extract.",
    inci: "Rubia cordifolia Root Extract",
    applications: "Detoxifying masks, body care, wellness products",
  },
  {
    id: 59,
    name: "Moringa Extract",
    category: "extract",
    description: "Superfood plant extract rich in antioxidants.",
    inci: "Moringa oleifera Leaf Extract",
    applications: "Nutritive serums, anti-aging creams, body care",
  },
  {
    id: 60,
    name: "Saw Palmetto Extract",
    category: "extract",
    description: "Traditional extract for scalp and hair health.",
    inci: "Serenoa repens Fruit Extract",
    applications: "Hair loss prevention, scalp treatments, men's grooming",
  },
  {
    id: 61,
    name: "Willow Bark Extract",
    category: "extract",
    description: "Natural exfoliating extract rich in salicylates.",
    inci: "Salix alba Bark Extract",
    applications: "Exfoliating serums, brightening treatments, body care",
  },
  {
    id: 62,
    name: "Rose Hip Extract",
    category: "extract",
    description: "Fruit extract rich in vitamin C and antioxidants.",
    inci: "Rosa canina Fruit Extract",
    applications: "Brightening serums, anti-aging creams, body care",
  },
  {
    id: 63,
    name: "Papaya Leaf Extract",
    category: "extract",
    description: "Enzyme-rich extract for gentle exfoliation.",
    inci: "Carica papaya Leaf Extract",
    applications: "Enzyme masks, brightening treatments, body care",
  },
  {
    id: 64,
    name: "Acai Berry Extract",
    category: "extract",
    description: "Super fruit extract loaded with antioxidants.",
    inci: "Euterpe oleracea Fruit Extract",
    applications: "Anti-aging serums, revitalizing masks, body care",
  },

  // Waters/Distillates/Hydrosols
  {
    id: 65,
    name: "Rose Hydrosol",
    category: "hydrosol",
    description: "Gentle floral water for toners and face mists.",
    inci: "Rosa damascena Floral Water",
    applications: "Toners, facial mists, lotions, cleansers",
  },
  {
    id: 66,
    name: "Chamomile Hydrosol",
    category: "hydrosol",
    description: "Calming floral water for sensitive skin.",
    inci: "Matricaria chamomilla Floral Water",
    applications: "Soothing toners, sensitive skincare, face mists",
  },
  {
    id: 67,
    name: "Lavender Hydrosol",
    category: "hydrosol",
    description: "Calming floral water for multi-purpose skincare.",
    inci: "Lavandula angustifolia Floral Water",
    applications: "Toners, setting sprays, sensitive skin care, aromatherapy",
  },
  {
    id: 68,
    name: "Tea Tree Hydrosol",
    category: "hydrosol",
    description: "Clarifying water for acne-prone skin.",
    inci: "Melaleuca alternifolia Floral Water",
    applications: "Acne toners, clarifying sprays, scalp treatments",
  },
  {
    id: 69,
    name: "Cucumber Hydrosol",
    category: "hydrosol",
    description: "Refreshing vegetable water for cooling.",
    inci: "Cucumis sativus Fruit Water",
    applications: "Refreshing toners, cooling sprays, under-eye care",
  },
  {
    id: 70,
    name: "Lemon Hydrosol",
    category: "hydrosol",
    description: "Bright citrus water for brightening and clarifying.",
    inci: "Citrus limon Fruit Water",
    applications: "Brightening toners, clarifying sprays, body care",
  },
  {
    id: 71,
    name: "Witch Hazel Hydrosol",
    category: "hydrosol",
    description: "Astringent water for pore refinement.",
    inci: "Hamamelis virginiana Distillate",
    applications: "Pore-refining toners, acne sprays, astringent tonics",
  },
  {
    id: 72,
    name: "Orange Peel Hydrosol",
    category: "hydrosol",
    description: "Uplifting citrus water for energizing formulations.",
    inci: "Citrus sinensis Peel Water",
    applications: "Energizing toners, uplifting sprays, aromatherapy",
  },
  {
    id: 73,
    name: "Lemongrass Hydrosol",
    category: "hydrosol",
    description: "Fresh herb water with antiseptic properties.",
    inci: "Cymbopogon citratus Distillate",
    applications: "Clarifying toners, body sprays, acne treatments",
  },
  {
    id: 74,
    name: "Rosemary Hydrosol",
    category: "hydrosol",
    description: "Stimulating herb water for scalp health.",
    inci: "Rosmarinus officinalis Distillate",
    applications: "Scalp treatments, hair growth sprays, body care",
  },
  {
    id: 75,
    name: "Basil Hydrosol",
    category: "hydrosol",
    description: "Antibacterial herb water for clarity.",
    inci: "Ocimum basilicum Distillate",
    applications: "Clarifying toners, acne treatments, aromatherapy",
  },
  {
    id: 76,
    name: "Aloe Vera Hydrosol",
    category: "hydrosol",
    description: "Soothing water for hydration and healing.",
    inci: "Aloe barbadensis Leaf Juice",
    applications: "Hydrating toners, soothing sprays, suncare",
  },
  {
    id: 77,
    name: "Beetroot Hydrosol",
    category: "hydrosol",
    description: "Nourishing vegetable water for vitality.",
    inci: "Beta vulgaris Root Water",
    applications: "Brightening toners, revitalizing sprays, body care",
  },
  {
    id: 78,
    name: "Turmeric Hydrosol",
    category: "hydrosol",
    description: "Golden spice water for anti-inflammatory benefits.",
    inci: "Curcuma longa Root Water",
    applications: "Soothing toners, brightening sprays, body care",
  },
  {
    id: 79,
    name: "Flax Seed Hydrosol",
    category: "hydrosol",
    description: "Soothing water with mucilage properties.",
    inci: "Linum usitatissimum Seed Distillate",
    applications: "Hydrating toners, soothing sprays, body care",
  },
  {
    id: 80,
    name: "Rice Water",
    category: "hydrosol",
    description: "Traditional brightening water for skin luminosity.",
    inci: "Oryza sativa Bran Water",
    applications: "Brightening toners, luminosity sprays, Asian skincare",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [basket, setBasket] = useState<number[]>([]);

  const categories = [
    { value: "essential-oil", label: "Essential Oils" },
    { value: "fixed-oil", label: "Fixed/Carrier Oils" },
    { value: "extract", label: "Plant Extracts" },
    { value: "hydrosol", label: "Hydrosols" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.inci.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === null || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const basketProducts = basket.map((id) => products.find((p) => p.id === id));

  const addToBasket = (productId: number) => {
    if (!basket.includes(productId)) {
      setBasket([...basket, productId]);
    }
  };

  const removeFromBasket = (productId: number) => {
    setBasket(basket.filter((id) => id !== productId));
  };

  return (
    <>
      <main className="bg-texture min-h-screen">
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by product name, INCI, or application..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === null
                      ? "bg-emerald-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-emerald-800 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Results counter */}
              <p className="text-sm text-slate-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-6 rounded-2xl border border-slate-100 bg-white card-hover cursor-pointer"
                      onClick={() => addToBasket(product.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                          {
                            categories.find((c) => c.value === product.category)
                              ?.label
                          }
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {product.description}
                      </p>
                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                          <span className="font-medium">INCI:</span>{" "}
                          {product.inci}
                        </p>
                        <p className="text-xs text-emerald-700 font-medium">
                          <span className="block text-slate-600 font-normal">
                            Applications:
                          </span>
                          {product.applications}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sticky top-28 h-fit">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Enquiry Basket ({basket.length})
                </h3>
                {basket.length > 0 ? (
                  <ul className="text-sm text-slate-600 space-y-2">
                    {basketProducts.map(
                      (product) =>
                        product && (
                          <li
                            key={product.id}
                            className="flex justify-between items-start"
                          >
                            <span>{product.name}</span>
                            <button
                              onClick={() => removeFromBasket(product.id)}
                              className="text-emerald-700 hover:text-emerald-900 font-semibold"
                            >
                              ✕
                            </button>
                          </li>
                        )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    No products added yet.
                  </p>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">
                  No products found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-emerald-800 font-medium hover:text-emerald-900"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
