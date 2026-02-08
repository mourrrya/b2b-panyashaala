/**
 * Page Content Constants
 * ======================
 * Contains structured content for about, quality, and FAQ sections.
 */

// =============================================================================
// APPROACH STEPS (About Page)
// =============================================================================

export const APPROACH_STEPS = [
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
] as const;

// =============================================================================
// FAQ DATA (Quality Page)
// =============================================================================

export const FAQ_DATA = [
  {
    question: "What testing standards do you follow?",
    answer:
      "We conduct GC/MS analysis, microbiology tests (aerobic plate count, pathogens), stability checks, and organoleptic evaluations aligned with ISO 9001 and GMP standards for cosmetic-grade ingredients.",
  },
  {
    question: "Do you provide documentation for compliance?",
    answer:
      "Yes, we supply Certificate of Analysis (COA), MSDS/SDS, INCI declarations, allergen data, IFRA statements, and technical dossiers per shipment.",
  },
  {
    question: "What are your MOQ and lead times?",
    answer:
      "Minimum order quantities vary by product but typically range from 5kg to 25kg. We dispatch samples within 72 hours and bulk orders within 2-4 weeks.",
  },
  {
    question: "Do you support customization?",
    answer:
      "Yes, we offer format customization (pH adjustment, viscosity modification), private labeling, and custom blends tailored to your formulation requirements.",
  },
] as const;

// =============================================================================
// QUALITY PAGE FEATURES
// =============================================================================

export const QUALITY_FEATURES = [
  {
    title: "Quality First",
    description:
      "Each lot undergoes organoleptic checks, purity analysis, microbiology, and stability review tailored to cosmetic-grade expectations.",
  },
  {
    title: "Sourcing & Traceability",
    description:
      "Direct programs with growers and extraction partners ensure farm-level traceability and sustainable harvest practices.",
  },
  {
    title: "Compliance",
    description:
      "COA, MSDS/SDS, IFRA statements, allergen data, and technical dossiers available per shipment.",
  },
] as const;
