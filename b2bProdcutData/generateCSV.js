/**
 * CSV Generator Script
 * Transforms product lists into properly structured CSV files matching Prisma schema
 */

const fs = require("fs");
const crypto = require("crypto");

// Generate UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

// Current timestamp in format: YYYY-MM-DD HH:MM:SS.mmm
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}

// INCI name mappings for common products
const inciMappings = {
  "essential-oil": {
    "Citronella Java": "Cymbopogon nardus Oil",
    Jasmine: "Jasminum sambac Oil",
    Peppermint: "Mentha piperita Oil",
    Ajwain: "Trachyspermum ammi Oil",
    Citronella: "Cymbopogon nardus Oil",
    "South Juniper Berry": "Juniperus communis Oil",
    Petitgrain: "Citrus aurantium ssp. amara Oil",
    Amyris: "Amyris balsamifera Oil",
    "Clary Sage": "Salvia sclarea Oil",
    Sage: "Salvia officinalis Oil",
    Lavender: "Lavandula angustifolia Oil",
    Aniseed: "Pimpinella anisum Oil",
    Clove: "Syzygium aromaticum Oil",
    Lemon: "Citrus limon Oil",
    Rose: "Rosa damascena Oil",
    "Bay Leaf": "Pimenta racemosa Oil",
    Coriander: "Coriandrum sativum Oil",
    Lemongrass: "Cymbopogon citratus Oil",
    Rosemary: "Rosmarinus officinalis Oil",
    Bergamot: "Citrus bergamia Oil",
    "Corn Mint": "Mentha arvensis Oil",
    Lime: "Citrus aurantifolia Oil",
    "Black Pepper": "Piper nigrum Oil",
    "Cumin Seed oil": "Cuminum cyminum Oil",
    Mandarin: "Citrus reticulata Oil",
    Cajeput: "Melaleuca cajuputi Oil",
    Cypress: "Cupressus sempervirens Oil",
    Marigold: "Tagetes minuta Oil",
    Spearmint: "Mentha spicata Oil",
    Calamus: "Acorus calamus Oil",
    Dilseed: "Anethum graveolens Oil",
    Marjoram: "Origanum majorana Oil",
    Calendula: "Calendula officinalis Oil",
    Eucalyptus: "Eucalyptus globulus Oil",
    "Mentha Piperata": "Mentha piperita Oil",
    Camphor: "Cinnamomum camphora Oil",
    Fennel: "Foeniculum vulgare Oil",
    Myrrh: "Commiphora myrrha Oil",
    "Sweet Basil": "Ocimum basilicum Oil",
    Capsicum: "Capsicum annuum Oil",
    Fenugreek: "Trigonella foenum-graecum Oil",
    Myrtle: "Myrtus communis Oil",
    Teatree: "Melaleuca alternifolia Oil",
    Caraway: "Carum carvi Oil",
    Frankincense: "Boswellia sacra Oil",
    Neroli: "Citrus aurantium Oil",
    Thyme: "Thymus vulgaris Oil",
    Cardamom: "Elettaria cardamomum Oil",
    Garlic: "Allium sativum Oil",
    Nutgrass: "Cyperus rotundus Oil",
    "Turmeric Leaf": "Curcuma longa Leaf Oil",
    Cedarwood: "Cedrus atlantica Oil",
    Geranium: "Pelargonium graveolens Oil",
    Nutmeg: "Myristica fragrans Oil",
    "Turmeric Root": "Curcuma longa Root Oil",
    "Celery Seed": "Apium graveolens Oil",
    Ginger: "Zingiber officinale Oil",
    Orange: "Citrus sinensis Oil",
    Turpentine: "Pinus sylvestris Oil",
    Chamomile: "Chamaemelum nobile Oil",
    Oregano: "Origanum vulgare Oil",
    Vetiver: "Vetiveria zizanioides Oil",
    Cinnamon: "Cinnamomum verum Oil",
    Grapefruit: "Citrus paradisi Oil",
    Palmarosa: "Cymbopogon martinii Oil",
    "Ylang Ylang": "Cananga odorata Oil",
    "Holy Basil": "Ocimum sanctum Oil",
    Patchouli: "Pogostemon cablin Oil",
  },
  "fixed-oil": {
    Almond: "Prunus amygdalus Oil",
    "Grape Seed (Green)": "Vitis vinifera Seed Oil",
    "Green Tea": "Camellia sinensis Seed Oil",
    Soyabean: "Glycine soja Oil",
    Aloevera: "Aloe barbadensis Leaf Oil",
    "Grape Seed (Yellow)": "Vitis vinifera Seed Oil",
    Sunflower: "Helianthus annuus Oil",
    "Amla Oil": "Phyllanthus emblica Oil",
    "Sweet Almond": "Prunus amygdalus Dulcis Oil",
    "Bitter Almond": "Prunus amygdalus Amara Oil",
    Apricot: "Prunus armeniaca Oil",
    "Jojoba Golden": "Simmondsia chinensis Oil",
    "Jojoba Colorless": "Simmondsia chinensis Oil",
    Walnut: "Juglans regia Oil",
    Arachis: "Arachis hypogaea Oil",
    Karanj: "Pongamia pinnata Oil",
    "Wheat Germ": "Triticum aestivum Germ Oil",
    "Argan (Normal)": "Argania spinosa Oil",
    "Linseed (Flaxseed) (Alsi)": "Linum usitatissimum Oil",
    "Argan (Moroccan)": "Argania spinosa Oil",
    Macadamia: "Macadamia ternifolia Oil",
    Avocado: "Persea gratissima Oil",
    Babassu: "Orbignya oleifera Oil",
    Moringa: "Moringa oleifera Oil",
    "Black Seed oil": "Nigella sativa Oil",
    Mustard: "Brassica juncea Oil",
    Blackcurrant: "Ribes nigrum Seed Oil",
    "Neem (Solvent Extracted)": "Azadirachta indica Oil",
    "Neem (Pure)": "Azadirachta indica Oil",
    Canola: "Brassica napus Oil",
    Olive: "Olea europaea Oil",
    Castor: "Ricinus communis Oil",
    "Onion Seed oil": "Allium cepa Seed Oil",
    "Onion oil": "Allium cepa Oil",
    Chaulmoogra: "Hydnocarpus wightianus Oil",
    "Peanut/Groundnut": "Arachis hypogaea Oil",
    "Coconut (Filtered)": "Cocos nucifera Oil",
    "Pomegranate Seed": "Punica granatum Seed Oil",
    "Coconut (Fractionated)": "Cocos nucifera Oil",
    "Rice Bran": "Oryza sativa Bran Oil",
    "Coconut (Refined)": "Cocos nucifera Oil",
    Seabuckthorn: "Hippophae rhamnoides Oil",
    "Coconut (Virgin)": "Cocos nucifera Oil",
    Sesame: "Sesamum indicum Oil",
  },
  hydrosol: {
    Aloevera: "Aloe barbadensis Floral Water",
    Cucumber: "Cucumis sativus Floral Water",
    Basil: "Ocimum basilicum Floral Water",
    "Tea Tree": "Melaleuca alternifolia Floral Water",
    Beetroot: "Beta vulgaris Floral Water",
    Lavender: "Lavandula angustifolia Floral Water",
    "Orange Peel": "Citrus sinensis Floral Water",
    "Witch Hazel": "Hamamelis virginiana Floral Water",
    Chamomile: "Chamaemelum nobile Floral Water",
    Lemon: "Citrus limon Floral Water",
    Rose: "Rosa damascena Floral Water",
    Clove: "Syzygium aromaticum Floral Water",
    "Lemon Grass": "Cymbopogon citratus Floral Water",
    Rosemary: "Rosmarinus officinalis Floral Water",
    Onion: "Allium cepa Floral Water",
    "Rice Water": "Oryza sativa Water",
    "Rice Fermented": "Oryza sativa Fermented Water",
    "Charcoal Water": "Charcoal Water",
    Turmeric: "Curcuma longa Floral Water",
    "Flex Seed": "Linum usitatissimum Floral Water",
  },
};

// Get INCI name
function getInci(name, category) {
  const categoryMap = inciMappings[category];
  if (categoryMap && categoryMap[name]) {
    return categoryMap[name];
  }

  // Fallback INCI generation
  if (category === "extract") {
    // For extracts in parentheses format "Common Name (Scientific Name)"
    const match = name.match(/\(([^)]+)\)/);
    if (match) {
      return match[1] + " Extract";
    }
    return name + " Extract";
  }

  return name;
}

// Get product description
function getDescription(name, category) {
  const lowerName = name.toLowerCase();

  if (category === "essential-oil") {
    if (lowerName.includes("lavender")) {
      return "Premium therapeutic-grade lavender oil for aromatherapy and formulations with calming and balancing properties.";
    }
    if (lowerName.includes("tea tree") || lowerName.includes("teatree")) {
      return "Antimicrobial oil for acne and problem skin treatments with powerful cleansing properties.";
    }
    if (lowerName.includes("peppermint")) {
      return "Cooling and invigorating oil for skincare and scalp treatments with refreshing and stimulating effects.";
    }
    if (lowerName.includes("rose")) {
      return "Precious floral oil for luxury skincare formulations with premium fragrance and skin benefits.";
    }
    if (lowerName.includes("frankincense")) {
      return "Precious resin oil for premium anti-aging skincare with deeply nourishing properties.";
    }
    if (lowerName.includes("eucalyptus")) {
      return "Refreshing and clarifying essential oil with invigorating properties for respiratory and skin care.";
    }
    if (
      lowerName.includes("lemon") ||
      lowerName.includes("citrus") ||
      lowerName.includes("orange") ||
      lowerName.includes("bergamot")
    ) {
      return "Bright citrus essential oil with uplifting aroma and natural cleansing properties.";
    }
    if (lowerName.includes("ginger")) {
      return "Warming essential oil with stimulating properties for circulation and muscle care.";
    }
    if (lowerName.includes("chamomile")) {
      return "Gentle calming essential oil ideal for sensitive skin and relaxation blends.";
    }
    return "Premium therapeutic-grade essential oil for aromatherapy and formulations.";
  }

  if (category === "fixed-oil") {
    if (lowerName.includes("jojoba")) {
      return "Golden carrier oil that closely mimics skin sebum for superior absorption and compatibility.";
    }
    if (lowerName.includes("argan")) {
      return "Luxury oil rich in vitamins and antioxidants for premium skincare formulations.";
    }
    if (lowerName.includes("coconut")) {
      return "Versatile carrier oil with moisturizing and nourishing properties for diverse applications.";
    }
    if (lowerName.includes("neem")) {
      return "Traditional botanical oil with potent properties for targeted skin treatments.";
    }
    if (lowerName.includes("castor")) {
      return "Rich emollient carrier oil excellent for hair care and skin conditioning.";
    }
    if (lowerName.includes("almond")) {
      return "Light nourishing carrier oil rich in vitamin E for gentle skincare formulations.";
    }
    if (lowerName.includes("avocado")) {
      return "Rich nutrient-dense carrier oil with deep moisturizing properties for dry skin care.";
    }
    if (lowerName.includes("olive")) {
      return "Classic carrier oil rich in antioxidants for nourishing skincare applications.";
    }
    return "Cold-pressed or solvent-extracted carrier oil for skincare and formulations.";
  }

  if (category === "extract") {
    if (lowerName.includes("ginseng")) {
      return "High-potency plant extract known for energizing and revitalizing skincare benefits.";
    }
    if (lowerName.includes("gotu kola") || lowerName.includes("centella")) {
      return "Botanical extract with powerful skin-repairing and healing properties.";
    }
    if (lowerName.includes("neem")) {
      return "Traditional extract with potent purifying and clarifying properties.";
    }
    if (lowerName.includes("turmeric")) {
      return "Golden extract with powerful anti-inflammatory and brightening properties.";
    }
    if (lowerName.includes("aloe")) {
      return "Soothing botanical extract with hydrating and healing properties.";
    }
    if (lowerName.includes("green tea") || lowerName.includes("matcha")) {
      return "Antioxidant-rich extract with protective and rejuvenating properties.";
    }
    if (lowerName.includes("rose") || lowerName.includes("hibiscus")) {
      return "Floral extract with skin-soothing and anti-aging benefits.";
    }
    if (lowerName.includes("ashwagandha")) {
      return "Adaptogenic extract for stress-relief and skin rejuvenation.";
    }
    if (lowerName.includes("bhringraj") || lowerName.includes("brahmi")) {
      return "Traditional Ayurvedic extract for hair growth and scalp health.";
    }
    return "High-potency botanical extract with concentrated active compounds.";
  }

  if (category === "hydrosol") {
    if (lowerName.includes("rose")) {
      return "Aromatic rose floral water with hydrating and luxurious skincare benefits.";
    }
    if (lowerName.includes("chamomile")) {
      return "Soothing floral water perfect for sensitive and reactive skin care.";
    }
    if (lowerName.includes("lavender")) {
      return "Calming floral water with balancing properties for all skin types.";
    }
    if (lowerName.includes("tea tree")) {
      return "Purifying floral water with natural antibacterial properties.";
    }
    if (lowerName.includes("witch hazel")) {
      return "Astringent floral water for toning and pore-refining treatments.";
    }
    return "Aromatic distilled floral water rich in botanical properties and antioxidants.";
  }

  return "High-quality botanical product for cosmetic formulations.";
}

// Get applications/benefits based on product
function getApplications(name, category) {
  const lowerName = name.toLowerCase();

  // Essential oils applications
  if (category === "essential-oil") {
    if (
      lowerName.includes("lavender") ||
      lowerName.includes("chamomile") ||
      lowerName.includes("rose")
    ) {
      return [
        "Promotes relaxation",
        "Reduces stress and anxiety",
        "Improves sleep quality",
        "Soothes skin irritation",
      ];
    }
    if (
      lowerName.includes("tea tree") ||
      lowerName.includes("teatree") ||
      lowerName.includes("thyme") ||
      lowerName.includes("clove")
    ) {
      return [
        "Natural antiseptic properties",
        "Helps clear acne",
        "Supports scalp health",
        "Freshens breath",
      ];
    }
    if (lowerName.includes("peppermint") || lowerName.includes("eucalyptus")) {
      return [
        "Provides cooling sensation",
        "Clears respiratory passages",
        "Boosts mental clarity",
        "Relieves muscle tension",
      ];
    }
    if (
      lowerName.includes("rosemary") ||
      lowerName.includes("ginger") ||
      lowerName.includes("cedarwood") ||
      lowerName.includes("black pepper")
    ) {
      return [
        "Stimulates hair growth",
        "Improves circulation",
        "Strengthens hair roots",
        "Adds shine to hair",
      ];
    }
    if (
      lowerName.includes("frankincense") ||
      lowerName.includes("neroli") ||
      lowerName.includes("jasmine") ||
      lowerName.includes("ylang")
    ) {
      return [
        "Reduces appearance of fine lines",
        "Promotes skin elasticity",
        "Provides luxury fragrance",
        "Balances skin tone",
      ];
    }
    if (
      lowerName.includes("lemon") ||
      lowerName.includes("bergamot") ||
      lowerName.includes("grapefruit") ||
      lowerName.includes("lime") ||
      lowerName.includes("orange")
    ) {
      return [
        "Brightens dull skin",
        "Natural degreaser",
        "Uplifting aroma",
        "Supports immune function",
      ];
    }
    return [
      "Aromatherapy benefits",
      "Natural fragrance",
      "Skincare formulations",
      "Wellness support",
    ];
  }

  // Fixed oils applications
  if (category === "fixed-oil") {
    if (
      lowerName.includes("jojoba") ||
      lowerName.includes("argan") ||
      lowerName.includes("macadamia")
    ) {
      return [
        "Balances skin oil production",
        "Anti-aging properties",
        "Deep moisturization",
        "Non-comedogenic",
      ];
    }
    if (
      lowerName.includes("coconut") ||
      lowerName.includes("sweet almond") ||
      lowerName.includes("avocado")
    ) {
      return [
        "Deep moisturization",
        "Nourishes dry skin",
        "Strengthens hair",
        "Gentle on sensitive skin",
      ];
    }
    if (lowerName.includes("neem") || lowerName.includes("black seed")) {
      return [
        "Anti-inflammatory properties",
        "Supports acne-prone skin",
        "Scalp health",
        "Natural healing",
      ];
    }
    if (
      lowerName.includes("sesame") ||
      lowerName.includes("amla") ||
      lowerName.includes("castor")
    ) {
      return [
        "Promotes hair growth",
        "Conditions scalp",
        "Prevents hair fall",
        "Adds natural shine",
      ];
    }
    if (
      lowerName.includes("olive") ||
      lowerName.includes("sunflower") ||
      lowerName.includes("grape")
    ) {
      return [
        "Rich in antioxidants",
        "Lightweight moisturizer",
        "Protects skin barrier",
        "Suitable for all skin types",
      ];
    }
    return [
      "Natural moisturization",
      "Carrier for essential oils",
      "Skin nourishment",
      "Hair conditioning",
    ];
  }

  // Extracts applications
  if (category === "extract") {
    if (
      lowerName.includes("ginseng") ||
      lowerName.includes("gotu kola") ||
      lowerName.includes("frankincense")
    ) {
      return [
        "Anti-aging benefits",
        "Boosts collagen production",
        "Improves skin elasticity",
        "Reduces wrinkles",
      ];
    }
    if (
      lowerName.includes("neem") ||
      lowerName.includes("turmeric") ||
      lowerName.includes("tea tree")
    ) {
      return [
        "Anti-inflammatory action",
        "Clears blemishes",
        "Purifies skin",
        "Natural antibacterial",
      ];
    }
    if (
      lowerName.includes("bhringraj") ||
      lowerName.includes("saw palmetto") ||
      lowerName.includes("brahmi")
    ) {
      return [
        "Promotes hair growth",
        "Reduces hair fall",
        "Strengthens hair follicles",
        "Conditions scalp",
      ];
    }
    if (
      lowerName.includes("rose") ||
      lowerName.includes("lavender") ||
      lowerName.includes("chamomile")
    ) {
      return [
        "Soothes irritated skin",
        "Natural calming effect",
        "Hydrates dry skin",
        "Anti-redness properties",
      ];
    }
    if (
      lowerName.includes("spirulina") ||
      lowerName.includes("green tea") ||
      lowerName.includes("matcha")
    ) {
      return [
        "Powerful antioxidant",
        "Protects against free radicals",
        "Brightens skin tone",
        "Anti-aging support",
      ];
    }
    if (
      lowerName.includes("ashwagandha") ||
      lowerName.includes("holy basil") ||
      lowerName.includes("tulsi")
    ) {
      return [
        "Adaptogenic benefits",
        "Reduces stress effects on skin",
        "Balances skin",
        "Natural wellness support",
      ];
    }
    if (lowerName.includes("aloe")) {
      return [
        "Soothes sunburn",
        "Hydrates intensely",
        "Heals minor wounds",
        "Calms irritation",
      ];
    }
    return [
      "Concentrated active compounds",
      "Targeted skincare benefits",
      "Natural botanical power",
      "Formulation enhancer",
    ];
  }

  // Hydrosols applications
  if (category === "hydrosol") {
    if (lowerName.includes("rose") || lowerName.includes("lavender")) {
      return [
        "Hydrates and tones skin",
        "Sets makeup naturally",
        "Calms redness",
        "Refreshes throughout day",
      ];
    }
    if (lowerName.includes("chamomile") || lowerName.includes("witch hazel")) {
      return [
        "Soothes sensitive skin",
        "Reduces inflammation",
        "Tightens pores",
        "Balances skin pH",
      ];
    }
    if (lowerName.includes("tea tree")) {
      return [
        "Clarifies oily skin",
        "Prevents breakouts",
        "Natural toner",
        "Purifies pores",
      ];
    }
    if (lowerName.includes("lemon") || lowerName.includes("orange")) {
      return [
        "Brightens complexion",
        "Energizing mist",
        "Natural astringent",
        "Refreshing spray",
      ];
    }
    return [
      "Natural skin toner",
      "Hydrating mist",
      "Makeup setting spray",
      "Refreshing throughout day",
    ];
  }

  return [
    "Natural botanical benefits",
    "Skincare support",
    "Wellness applications",
    "Formulation ingredient",
  ];
}

// Get usage instructions based on category
function getUsage(name, category) {
  const lowerName = name.toLowerCase();

  if (category === "essential-oil") {
    return "Add 3-5 drops to diffuser or dilute in carrier oil before topical use. Do not apply undiluted to skin.";
  }
  if (category === "fixed-oil") {
    if (
      lowerName.includes("castor") ||
      lowerName.includes("amla") ||
      lowerName.includes("sesame")
    ) {
      return "Massage into scalp and hair. Leave for 30 minutes or overnight. Wash with mild shampoo.";
    }
    return "Apply directly to skin or hair. Massage gently until absorbed. Use as carrier oil for essential oils.";
  }
  if (category === "extract") {
    return "Add to formulations at 1-5% concentration. Mix well before use. Suitable for creams, serums, and lotions.";
  }
  if (category === "hydrosol") {
    return "Spray on face or body as toner. Use after cleansing or as refreshing mist throughout the day.";
  }
  return "Follow formulation guidelines. Test on small area before use.";
}

// Get ingredients list (botanical name as primary ingredient)
function getIngredients(name, category, botanicalName) {
  const ingredients = [botanicalName || name];
  return ingredients;
}

// Escape CSV value
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("[")
  ) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Format JSON array for CSV
function formatJSONArray(arr) {
  return JSON.stringify(arr);
}

// Product data arrays
const essentialOils = [
  "Citronella Java",
  "Jasmine",
  "Peppermint",
  "Ajwain",
  "Citronella",
  "South Juniper Berry",
  "Petitgrain",
  "Amyris",
  "Clary Sage",
  "Sage",
  "Lavender",
  "Aniseed",
  "Clove",
  "Lemon",
  "Rose",
  "Bay Leaf",
  "Coriander",
  "Lemongrass",
  "Rosemary",
  "Bergamot",
  "Corn Mint",
  "Lime",
  "Black Pepper",
  "Cumin Seed oil",
  "Mandarin",
  "Cajeput",
  "Cypress",
  "Marigold",
  "Spearmint",
  "Calamus",
  "Dilseed",
  "Marjoram",
  "Calendula",
  "Eucalyptus",
  "Mentha Piperata",
  "Camphor",
  "Fennel",
  "Myrrh",
  "Sweet Basil",
  "Capsicum",
  "Fenugreek",
  "Myrtle",
  "Teatree",
  "Caraway",
  "Frankincense",
  "Neroli",
  "Thyme",
  "Cardamom",
  "Garlic",
  "Nutgrass",
  "Turmeric Leaf",
  "Cedarwood",
  "Geranium",
  "Nutmeg",
  "Turmeric Root",
  "Celery Seed",
  "Ginger",
  "Orange",
  "Turpentine",
  "Chamomile",
  "Oregano",
  "Vetiver",
  "Cinnamon",
  "Grapefruit",
  "Palmarosa",
  "Ylang Ylang",
  "Holy Basil",
  "Patchouli",
];

const fixedOils = [
  "Almond",
  "Grape Seed (Green)",
  "Green Tea",
  "Soyabean",
  "Aloevera",
  "Grape Seed (Yellow)",
  "Sunflower",
  "Amla Oil",
  "Sweet Almond",
  "Bitter Almond",
  "Apricot",
  "Jojoba Golden",
  "Jojoba Colorless",
  "Walnut",
  "Arachis",
  "Karanj",
  "Wheat Germ",
  "Argan (Normal)",
  "Linseed (Flaxseed) (Alsi)",
  "Argan (Moroccan)",
  "Macadamia",
  "Avocado",
  "Babassu",
  "Moringa",
  "Black Seed oil",
  "Mustard",
  "Blackcurrant",
  "Neem (Solvent Extracted)",
  "Neem (Pure)",
  "Canola",
  "Olive",
  "Castor",
  "Onion Seed oil",
  "Onion oil",
  "Chaulmoogra",
  "Peanut/Groundnut",
  "Coconut (Filtered)",
  "Pomegranate Seed",
  "Coconut (Fractionated)",
  "Rice Bran",
  "Coconut (Refined)",
  "Seabuckthorn",
  "Coconut (Virgin)",
  "Sesame",
];

const extracts = [
  "Ginseng (Panax Ginseng)",
  "Neem (Azadirachta Indica)",
  "Aloe vera (Aloe Barbadensis)",
  "Gokhru (Tribulus Terrestris)",
  "Nettle leaf (Urtica Dioica L.)",
  "Amla (Phyllanthus Emblica)",
  "Gotu Kola (Centella Asiatica)",
  "Nirgundi (Vitex Negundo)",
  "Arjun (Terminalia Arjuna)",
  "Hadjod (Cissus Quadrangularis)",
  "Papaya Leaf (Carica Papaya)",
  "Arnica (Arnica Montana L)",
  "Heena (Lawsonia Inermis)",
  "Reetha (Sapindus Mukorossi)",
  "Ashok bark (Saraca Asoca)",
  "Indigo Leaf (Indigofera Tinctoria)",
  "Reishi (Ganoderma Lucidum)",
  "Ashwagandha (Withania Somnifera)",
  "Kalmegh (Andrographis Paniculata)",
  "Saw Palmetto (Serenoa Repens)",
  "Babool (Vachellia Nilotica)",
  "Kaunch (Mucuna Pruriens)",
  "Shallaki Guggal (Boswellia Serrata)",
  "Bamboo (Bambusa Vulgaris)",
  "Kokum (Garcinia Indica)",
  "Shatavari (Asparagus Racemosus)",
  "Bhringraj (Eclipta Alba)",
  "Maidenhair Tree (Ginkgo Biloba)",
  "Shikakai (Acacia Concinna)",
  "Bhui Amla (Phyllanthus Niruri)",
  "Makoy (Solanum Nigrum)",
  "Spirulina (Arthrospira Platensis)",
  "Brahmi (Bacopa Monnieri)",
  "Manjistha (Rubia Cordifolia)",
  "Stevia (Stevia Rebaudiana)",
  "Daru Haldi (Berberis Aristata)",
  "Moringa (Moringa Oleifera)",
  "Tulsi (Ocimum Sanctum)",
  "Geranium (Pelargonium)",
  "Mulethi (Licorice)",
  "Willow Bark (Salix Nigra)",
  "Giloy (Tinospora Cordifolia)",
  "Nagarmotha (Cyperus Scariosus)",
  "Witch Hazel (Hamamelis)",
  "Acai Berry",
  "Lilly",
  "Apple",
  "Lotus",
  "Apricot",
  "Mandarin",
  "Avocado",
  "Mango",
  "Banana",
  "Marigold",
  "Beet Root",
  "Mulberry",
  "Blackberry",
  "Oak",
  "Carrot",
  "Orange",
  "Chamomile",
  "Peach",
  "Chasteberry",
  "Pear",
  "Cherry",
  "Pineapple",
  "Coconut",
  "Plum",
  "Cranberry",
  "Pomegranate",
  "Cucumber",
  "Raspberry",
  "Dragon Fruit",
  "Rose",
  "Grapes",
  "Spinach",
  "Guava",
  "Strawberry",
  "Hibiscus",
  "Sugarcane",
  "Lavender",
  "Tomato",
  "Lemon",
  "Watermelon",
  "Black Cumin Seed",
  "Pumpkin Seed",
  "Black Pepper",
  "Rice",
  "Cardamom",
  "Rosemary",
  "Carom Seed",
  "Sage",
  "Chia Seed",
  "Fennel Seed",
  "Cinnamon",
  "Thyme",
  "Clove",
  "Tamarind",
  "Coffee bean",
  "Turmeric",
  "Coriander",
  "Vanilla",
  "Curry Leaf",
  "Almond",
  "Garlic",
  "Areca Nut",
  "Ginger",
  "Goji Berry",
  "Green Tea",
  "Cumin",
  "Honey",
  "Nutmeg",
  "Lemon Balm",
  "Walnut",
  "Matcha Tea",
  "Flax Seed",
  "Fenugreek",
  "Mushroom",
  "Onion",
  "Peppermint",
];

const hydrosols = [
  "Aloevera",
  "Cucumber",
  "Basil",
  "Tea Tree",
  "Beetroot",
  "Lavender",
  "Orange Peel",
  "Witch Hazel",
  "Chamomile",
  "Lemon",
  "Rose",
  "Clove",
  "Lemon Grass",
  "Rosemary",
  "Onion",
  "Rice Water",
  "Rice Fermented",
  "Charcoal Water",
  "Turmeric",
  "Flex Seed",
];

// Generate products and variants
const products = [];
const variants = [];
const timestamp = getTimestamp();

// Process Essential Oils
for (const oilName of essentialOils) {
  const productId = generateUUID();
  const productName = oilName + " Essential Oil";
  const category = "ESSENTIAL_OIL";
  const botanicalName = getInci(oilName, "essential-oil");

  products.push({
    id: productId,
    name: productName,
    category: category,
    description: getDescription(oilName, "essential-oil"),
    botanicalName: botanicalName,
    extractionMethod: "STEAM_DISTILLATION",
    chemicalFormula: "",
    casNumber: "",
    hazardClass: "NON_HAZARDOUS",
    supplier: "Rehmat",
    certifications: formatJSONArray(["ORGANIC"]),
    storageConditions: "Store in cool, dry place away from direct sunlight",
    isDeleted: "false",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Create variants for this product
  const sizes = ["30ml"];
  const basePrices = { "30ml": 150, "100ml": 400, "250ml": 900 };

  for (const size of sizes) {
    const variantId = generateUUID();
    const basePrice = basePrices[size];

    variants.push({
      id: variantId,
      productId: productId,
      variantName: `${productName} - ${size} - GLASS_BOTTLE - 100%`,
      description: getDescription(oilName, "essential-oil"),
      size: size,
      concentration: "100%",
      packaging: "GLASS_BOTTLE",
      retailPrice: basePrice.toFixed(2),
      wholesalePrice: (basePrice * 0.85).toFixed(2),
      costPrice: (basePrice * 0.7).toFixed(2),
      initialStock: 10,
      minStockLevel: 5,
      isDeleted: "false",
      createdAt: timestamp,
      updatedAt: timestamp,
      benefits: formatJSONArray(getApplications(oilName, "essential-oil")),
      ingredients: formatJSONArray(
        getIngredients(oilName, "essential-oil", botanicalName)
      ),
      usage: getUsage(oilName, "essential-oil"),
    });
  }
}

// Process Fixed Oils
for (const oilName of fixedOils) {
  const productId = generateUUID();
  const productName = oilName + (oilName.includes("Oil") ? "" : " Oil");
  const category = "FIXED_OIL";
  const botanicalName = getInci(oilName, "fixed-oil");

  products.push({
    id: productId,
    name: productName,
    category: category,
    description: getDescription(oilName, "fixed-oil"),
    botanicalName: botanicalName,
    extractionMethod: "COLD_PRESS",
    chemicalFormula: "",
    casNumber: "",
    hazardClass: "NON_HAZARDOUS",
    supplier: "Rehmat",
    certifications: formatJSONArray(["ORGANIC"]),
    storageConditions: "Store in cool, dry place away from direct sunlight",
    isDeleted: "false",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Create variants for this product
  const sizes = ["100ml"];
  const basePrices = { "100ml": 200, "250ml": 450, "500ml": 850 };

  for (const size of sizes) {
    const variantId = generateUUID();
    const basePrice = basePrices[size];

    variants.push({
      id: variantId,
      productId: productId,
      variantName: `${productName} - ${size} - PLASTIC_BOTTLE - 100%`,
      description: getDescription(oilName, "fixed-oil"),
      size: size,
      concentration: "100%",
      packaging: "PLASTIC_BOTTLE",
      retailPrice: basePrice.toFixed(2),
      wholesalePrice: (basePrice * 0.85).toFixed(2),
      costPrice: (basePrice * 0.7).toFixed(2),
      initialStock: 10,
      minStockLevel: 5,
      isDeleted: "false",
      createdAt: timestamp,
      updatedAt: timestamp,
      benefits: formatJSONArray(getApplications(oilName, "fixed-oil")),
      ingredients: formatJSONArray(
        getIngredients(oilName, "fixed-oil", botanicalName)
      ),
      usage: getUsage(oilName, "fixed-oil"),
    });
  }
}

// Process Extracts
for (const extractName of extracts) {
  const productId = generateUUID();
  const commonName = extractName.split(" (")[0].trim();
  const productName = commonName + " Extract";
  const category = "EXTRACT";
  const botanicalName = getInci(extractName, "extract");

  products.push({
    id: productId,
    name: productName,
    category: category,
    description: getDescription(commonName, "extract"),
    botanicalName: botanicalName,
    extractionMethod: "SOLVENT_EXTRACTION",
    chemicalFormula: "",
    casNumber: "",
    hazardClass: "NON_HAZARDOUS",
    supplier: "Rehmat",
    certifications: formatJSONArray(["ISO_9001"]),
    storageConditions: "Store in cool, dry place away from direct sunlight",
    isDeleted: "false",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Create variants for this product
  const sizes = ["50g"];
  const basePrices = { "50g": 180, "100g": 320, "250g": 720 };

  for (const size of sizes) {
    const variantId = generateUUID();
    const basePrice = basePrices[size];

    variants.push({
      id: variantId,
      productId: productId,
      variantName: `${productName} - ${size} - JAR - 100%`,
      description: getDescription(commonName, "extract"),
      size: size,
      concentration: "100%",
      packaging: "JAR",
      retailPrice: basePrice.toFixed(2),
      wholesalePrice: (basePrice * 0.85).toFixed(2),
      costPrice: (basePrice * 0.7).toFixed(2),
      initialStock: 10,
      minStockLevel: 5,
      isDeleted: "false",
      createdAt: timestamp,
      updatedAt: timestamp,
      benefits: formatJSONArray(getApplications(commonName, "extract")),
      ingredients: formatJSONArray(
        getIngredients(commonName, "extract", botanicalName)
      ),
      usage: getUsage(commonName, "extract"),
    });
  }
}

// Process Hydrosols
for (const hydrosolName of hydrosols) {
  const productId = generateUUID();
  const productName = hydrosolName + " Hydrosol";
  const category = "HYDROSOL";
  const botanicalName = getInci(hydrosolName, "hydrosol");

  products.push({
    id: productId,
    name: productName,
    category: category,
    description: getDescription(hydrosolName, "hydrosol"),
    botanicalName: botanicalName,
    extractionMethod: "STEAM_DISTILLATION",
    chemicalFormula: "",
    casNumber: "",
    hazardClass: "NON_HAZARDOUS",
    supplier: "Rehmat",
    certifications: formatJSONArray(["ORGANIC"]),
    storageConditions:
      "Store in cool, dry place away from direct sunlight. Refrigerate after opening.",
    isDeleted: "false",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Create variants for this product
  const sizes = ["100ml"];
  const basePrices = { "100ml": 120, "200ml": 220, "500ml": 480 };

  for (const size of sizes) {
    const variantId = generateUUID();
    const basePrice = basePrices[size];

    variants.push({
      id: variantId,
      productId: productId,
      variantName: `${productName} - ${size} - SPRAY_BOTTLE - 100%`,
      description: getDescription(hydrosolName, "hydrosol"),
      size: size,
      concentration: "100%",
      packaging: "SPRAY_BOTTLE",
      retailPrice: basePrice.toFixed(2),
      wholesalePrice: (basePrice * 0.85).toFixed(2),
      costPrice: (basePrice * 0.7).toFixed(2),
      initialStock: 10,
      minStockLevel: 5,
      isDeleted: "false",
      createdAt: timestamp,
      updatedAt: timestamp,
      benefits: formatJSONArray(getApplications(hydrosolName, "hydrosol")),
      ingredients: formatJSONArray(
        getIngredients(hydrosolName, "hydrosol", botanicalName)
      ),
      usage: getUsage(hydrosolName, "hydrosol"),
    });
  }
}

// Generate Products CSV
const productsHeader =
  "id,name,category,description,botanicalName,extractionMethod,chemicalFormula,casNumber,hazardClass,supplier,certifications,storageConditions,isDeleted,createdAt,updatedAt";
const productsRows = products.map((p) =>
  [
    escapeCSV(p.id),
    escapeCSV(p.name),
    escapeCSV(p.category),
    escapeCSV(p.description),
    escapeCSV(p.botanicalName),
    escapeCSV(p.extractionMethod),
    escapeCSV(p.chemicalFormula),
    escapeCSV(p.casNumber),
    escapeCSV(p.hazardClass),
    escapeCSV(p.supplier),
    escapeCSV(p.certifications),
    escapeCSV(p.storageConditions),
    escapeCSV(p.isDeleted),
    escapeCSV(p.createdAt),
    escapeCSV(p.updatedAt),
  ].join(",")
);

const productsCSV = productsHeader + "\n" + productsRows.join("\n");

// Generate Variants CSV
const variantsHeader =
  "id,productId,variantName,description,size,concentration,packaging,retailPrice,wholesalePrice,costPrice,initialStock,minStockLevel,isDeleted,createdAt,updatedAt,benefits,ingredients,usage";
const variantsRows = variants.map((v) =>
  [
    escapeCSV(v.id),
    escapeCSV(v.productId),
    escapeCSV(v.variantName),
    escapeCSV(v.description),
    escapeCSV(v.size),
    escapeCSV(v.concentration),
    escapeCSV(v.packaging),
    escapeCSV(v.retailPrice),
    escapeCSV(v.wholesalePrice),
    escapeCSV(v.costPrice),
    escapeCSV(v.initialStock),
    escapeCSV(v.minStockLevel),
    escapeCSV(v.isDeleted),
    escapeCSV(v.createdAt),
    escapeCSV(v.updatedAt),
    escapeCSV(v.benefits),
    escapeCSV(v.ingredients),
    escapeCSV(v.usage),
  ].join(",")
);

const variantsCSV = variantsHeader + "\n" + variantsRows.join("\n");

// Write CSV files
fs.writeFileSync("products_import.csv", productsCSV, "utf8");
fs.writeFileSync("variants_import.csv", variantsCSV, "utf8");

console.log(`Generated ${products.length} products`);
console.log(`Generated ${variants.length} variants`);
console.log("Files created: products_import.csv, variants_import.csv");
