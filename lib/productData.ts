import type { Product } from "../store/store";

// INCI name mappings for common products
const inciMappings: Record<string, Record<string, string>> = {
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

// Product descriptions mapping
const descriptionMappings: Record<string, Record<string, string>> = {
  "essential-oil": {
    default:
      "Premium therapeutic-grade essential oil for aromatherapy and formulations.",
  },
  "fixed-oil": {
    default:
      "Cold-pressed or solvent-extracted carrier oil for skincare and formulations.",
  },
  extract: {
    default:
      "High-potency botanical extract with concentrated active compounds.",
  },
  hydrosol: {
    default:
      "Aromatic distilled floral water rich in botanical properties and antioxidants.",
  },
};

// Applications mapping based on product type and name
function getApplications(name: string, category: string): string {
  const lowerName = name.toLowerCase();

  // Essential oils applications
  if (category === "essential-oil") {
    if (
      lowerName.includes("lavender") ||
      lowerName.includes("chamomile") ||
      lowerName.includes("rose")
    ) {
      return "Serums, toners, aromatherapy diffusers, bath products, skincare";
    }
    if (
      lowerName.includes("tea tree") ||
      lowerName.includes("teatree") ||
      lowerName.includes("thyme") ||
      lowerName.includes("clove")
    ) {
      return "Acne treatments, scalp treatments, body care";
    }
    if (lowerName.includes("peppermint") || lowerName.includes("eucalyptus")) {
      return "Cooling masks, scalp treatments, body care, aromatherapy";
    }
    if (
      lowerName.includes("rosemary") ||
      lowerName.includes("ginger") ||
      lowerName.includes("cedarwood") ||
      lowerName.includes("black pepper")
    ) {
      return "Hair growth serums, scalp treatments, body care";
    }
    if (
      lowerName.includes("frankincense") ||
      lowerName.includes("neroli") ||
      lowerName.includes("jasmine") ||
      lowerName.includes("ylang")
    ) {
      return "Anti-aging creams, luxury serums, aromatherapy, perfumes";
    }
    if (
      lowerName.includes("lemon") ||
      lowerName.includes("bergamot") ||
      lowerName.includes("grapefruit") ||
      lowerName.includes("lime")
    ) {
      return "Brightening serums, cleansers, aromatherapy";
    }
    if (lowerName.includes("citronella") || lowerName.includes("coriander")) {
      return "Insect-repelling formulations, body care";
    }
    return "Aromatherapy, skincare, perfumes, body care";
  }

  // Fixed oils applications
  if (category === "fixed-oil") {
    if (
      lowerName.includes("jojoba") ||
      lowerName.includes("argan") ||
      lowerName.includes("rosehip") ||
      lowerName.includes("macadamia")
    ) {
      return "Anti-aging serums, facial oils, luxury skincare";
    }
    if (
      lowerName.includes("coconut") ||
      lowerName.includes("sweet almond") ||
      lowerName.includes("avocado")
    ) {
      return "Moisturizing creams, body butters, hair care";
    }
    if (lowerName.includes("neem") || lowerName.includes("black seed")) {
      return "Acne treatments, anti-inflammatory products, scalp care";
    }
    if (
      lowerName.includes("sesame") ||
      lowerName.includes("amla") ||
      lowerName.includes("castor")
    ) {
      return "Hair care, scalp treatments, massage oils";
    }
    if (
      lowerName.includes("olive") ||
      lowerName.includes("sunflower") ||
      lowerName.includes("grapeseed")
    ) {
      return "Serums, cleansers, moisturizers, body care";
    }
    if (lowerName.includes("moringa")) {
      return "Anti-aging, moisturizing, nutritive skincare";
    }
    return "Skincare formulations, body care, massage oils";
  }

  // Extracts applications
  if (category === "extract") {
    if (
      lowerName.includes("ginseng") ||
      lowerName.includes("gotu kola") ||
      lowerName.includes("frankincense")
    ) {
      return "Anti-aging serums, luxury products, skin rejuvenation";
    }
    if (
      lowerName.includes("neem") ||
      lowerName.includes("turmeric") ||
      lowerName.includes("tea tree")
    ) {
      return "Acne treatments, anti-inflammatory products, scalp care";
    }
    if (
      lowerName.includes("bhringraj") ||
      lowerName.includes("saw palmetto") ||
      lowerName.includes("brahmi")
    ) {
      return "Hair care, scalp treatments, hair growth products";
    }
    if (lowerName.includes("rose") || lowerName.includes("lavender")) {
      return "Soothing products, aromatherapy, relaxation formulations";
    }
    if (lowerName.includes("spirulina") || lowerName.includes("green tea")) {
      return "Anti-aging, antioxidant-rich skincare, beauty supplements";
    }
    if (lowerName.includes("ashwagandha") || lowerName.includes("holy basil")) {
      return "Stress-relief, wellness products, ayurvedic formulations";
    }
    return "Botanical formulations, skincare, wellness products";
  }

  // Hydrosols applications
  if (category === "hydrosol") {
    if (lowerName.includes("rose") || lowerName.includes("lavender")) {
      return "Face toners, serums, moisturizers, aromatherapy sprays";
    }
    if (lowerName.includes("chamomile") || lowerName.includes("witch hazel")) {
      return "Soothing toners, sensitive skin care, calming products";
    }
    if (lowerName.includes("tea tree")) {
      return "Acne treatments, clarifying toners, body care";
    }
    if (lowerName.includes("lemon") || lowerName.includes("orange")) {
      return "Brightening toners, cleansers, energizing sprays";
    }
    return "Face toners, cleansers, hydrating sprays";
  }

  return "General skincare and cosmetic formulations";
}

function getDescription(name: string, category: string): string {
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
  }

  if (category === "extract") {
    if (lowerName.includes("ginseng")) {
      return "High-potency plant extract known for energizing and revitalizing skincare benefits.";
    }
    if (lowerName.includes("gotu kola")) {
      return "Botanical extract with powerful skin-repairing and healing properties.";
    }
    if (lowerName.includes("neem")) {
      return "Traditional extract with potent purifying and clarifying properties.";
    }
  }

  if (category === "hydrosol") {
    if (lowerName.includes("rose")) {
      return "Aromatic rose floral water with hydrating and luxurious skincare benefits.";
    }
    if (lowerName.includes("chamomile")) {
      return "Soothing floral water perfect for sensitive and reactive skin care.";
    }
  }

  return (
    descriptionMappings[category]?.default ||
    "High-quality botanical product for cosmetic formulations."
  );
}

function getInci(name: string, category: string): string {
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

export function getProductsData(): Product[] {
  const products: Product[] = [];
  let productId = 1;

  // Essential Oils
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

  for (const oilName of essentialOils) {
    products.push({
      id: productId++,
      name: oilName + " Essential Oil",
      category: "essential-oil",
      description: getDescription(oilName, "essential-oil"),
      inci: getInci(oilName, "essential-oil"),
      applications: getApplications(oilName, "essential-oil"),
    });
  }

  // Fixed Oils
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

  for (const oilName of fixedOils) {
    products.push({
      id: productId++,
      name: oilName + (oilName.includes("Oil") ? "" : " Oil"),
      category: "fixed-oil",
      description: getDescription(oilName, "fixed-oil"),
      inci: getInci(oilName, "fixed-oil"),
      applications: getApplications(oilName, "fixed-oil"),
    });
  }

  // Extracts
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

  for (const extractName of extracts) {
    const commonName = extractName.split(" (")[0].trim();
    products.push({
      id: productId++,
      name: commonName + " Extract",
      category: "extract",
      description: getDescription(commonName, "extract"),
      inci: getInci(extractName, "extract"),
      applications: getApplications(commonName, "extract"),
    });
  }

  // Hydrosols
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

  for (const hydrosol of hydrosols) {
    products.push({
      id: productId++,
      name: hydrosol + " Hydrosol",
      category: "hydrosol",
      description: getDescription(hydrosol, "hydrosol"),
      inci: getInci(hydrosol, "hydrosol"),
      applications: getApplications(hydrosol, "hydrosol"),
    });
  }

  return products;
}
