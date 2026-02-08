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
// PRODUCT CATEGORY ROUTES
// =============================================================================

export const CATEGORY_ROUTES = {
  ESSENTIAL_OILS: `${PUBLIC_NAV.PRODUCTS}?category=essential-oil`,
  FIXED_OILS: `${PUBLIC_NAV.PRODUCTS}?category=fixed-oil`,
  EXTRACTS: `${PUBLIC_NAV.PRODUCTS}?category=extract`,
  HYDROSOLS: `${PUBLIC_NAV.PRODUCTS}?category=hydrosol`,
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
    { href: CATEGORY_ROUTES.ESSENTIAL_OILS, label: "Essential Oils" },
    { href: CATEGORY_ROUTES.FIXED_OILS, label: "Carrier Oils" },
    { href: CATEGORY_ROUTES.EXTRACTS, label: "Extracts" },
    { href: CATEGORY_ROUTES.HYDROSOLS, label: "Hydrosols" },
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
  HOME: { name: "Home", path: PUBLIC_NAV.HOME },
  PRODUCTS: { name: "Products", path: PUBLIC_NAV.PRODUCTS },
  ABOUT: { name: "About", path: PUBLIC_NAV.ABOUT },
  APPLICATIONS: { name: "Applications", path: PUBLIC_NAV.APPLICATIONS },
  QUALITY: { name: "Quality", path: PUBLIC_NAV.QUALITY },
  CONTACT: { name: "Contact", path: PUBLIC_NAV.CONTACT },
} as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

// =============================================================================
// NAVIGATION CONFIGURATIONS
// =============================================================================

export const NAVIGATION_CONFIG = {
  /** Routes that require authentication */
  PROTECTED: [PRIVATE_NAV.PROFILE, PRIVATE_NAV.ORDERS],

  /** Routes that redirect authenticated users */
  AUTH_ONLY: [PUBLIC_NAV.LOGIN],

  /** Routes disallowed for robots */
  ROBOTS_DISALLOW: ["/api/", "/admin/", "/_private/"],
} as const;
