/**
 * Navigation Constants
 * ====================
 * Contains navigation links for header and footer.
 */

// =============================================================================
// CLIENT-SIDE ROUTES
// =============================================================================

export const PUBLIC_NAV = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  ABOUT: "/about",
  APPLICATIONS: "/applications",
  QUALITY: "/quality",
  CONTACT: "/contact",
  LOGIN: "/login",
  SITEMAP: "/sitemap.xml",
} as const;

// =============================================================================
// PRIVATE ROUTES (require authentication)
// =============================================================================

export const PRIVATE_NAV = {
  PROFILE: "/profile",
  ORDERS: "/order",
  ORDER_DETAIL: (id: string) => `/order/${id}`,
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV_LINKS = [
  { href: PUBLIC_NAV.PRODUCTS, label: "Products" },
  { href: PUBLIC_NAV.ABOUT, label: "About" },
  { href: PUBLIC_NAV.APPLICATIONS, label: "Applications" },
  { href: PUBLIC_NAV.QUALITY, label: "Quality" },
  { href: PUBLIC_NAV.CONTACT, label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { href: "/products?category=essential-oil", label: "Essential Oils" },
    { href: "/products?category=fixed-oil", label: "Carrier Oils" },
    { href: "/products?category=extract", label: "Extracts" },
    { href: "/products?category=hydrosol", label: "Hydrosols" },
  ],
  resources: [
    { href: PUBLIC_NAV.ABOUT, label: "About Us" },
    { href: PUBLIC_NAV.QUALITY, label: "Quality" },
    { href: PUBLIC_NAV.APPLICATIONS, label: "Applications" },
    { href: PUBLIC_NAV.SITEMAP, label: "Sitemap", external: true },
  ],
} as const;

// =============================================================================
// BREADCRUMB DEFINITIONS
// =============================================================================

export const BREADCRUMBS = {
  HOME: { name: "Home", path: "/" },
  PRODUCTS: { name: "Products", path: "/products" },
  ABOUT: { name: "About", path: "/about" },
  APPLICATIONS: { name: "Applications", path: "/applications" },
  QUALITY: { name: "Quality", path: "/quality" },
  CONTACT: { name: "Contact", path: "/contact" },
} as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};
