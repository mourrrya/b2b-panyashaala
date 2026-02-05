/**
 * Navigation Constants
 * ====================
 * Contains navigation links for header and footer.
 */

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/applications", label: "Applications" },
  { href: "/quality", label: "Quality" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { href: "/products?category=essential-oil", label: "Essential Oils" },
    { href: "/products?category=fixed-oil", label: "Carrier Oils" },
    { href: "/products?category=extract", label: "Extracts" },
    { href: "/products?category=hydrosol", label: "Hydrosols" },
  ],
  resources: [
    { href: "/about", label: "About Us" },
    { href: "/quality", label: "Quality" },
    { href: "/applications", label: "Applications" },
    { href: "/sitemap.xml", label: "Sitemap", external: true },
  ],
} as const;
