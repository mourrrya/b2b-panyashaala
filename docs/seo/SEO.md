# SEO Implementation Guide

> **Domain**: `https://aukra.co.in` · **Stack**: Next.js 16 + Prisma · **Last Updated**: Feb 2026

---

## Architecture Overview

```
lib/constants/config.ts      → Site URL, brand name, contact info, social handles
lib/constants/seo.ts         → Per-page metadata (title, description, keywords, canonical)
lib/constants/metadata.ts    → Schema.org config, animation timings
lib/constants/navigation.ts  → Routes, breadcrumbs, robots disallow list
lib/seo.ts                   → createMetadata(), JSON-LD builders, JsonLd component
```

### How Pages Get SEO

| Route                                                   | Metadata Source                         | Structured Data                |
| ------------------------------------------------------- | --------------------------------------- | ------------------------------ |
| `app/layout.tsx`                                        | Static `metadata` export                | Organization + Website schemas |
| `app/page.tsx`                                          | `createMetadata(PAGE_SEO.HOME)`         | — (inherits from layout)       |
| `app/(public)/products/page.tsx`                        | `createMetadata(PAGE_SEO.PRODUCTS)`     | Breadcrumb                     |
| `app/(public)/products/[productId]/page.tsx`            | `generateMetadata()` (dynamic)          | Product + Breadcrumb           |
| `app/(public)/about/page.tsx`                           | `createMetadata(PAGE_SEO.ABOUT)`        | Breadcrumb                     |
| `app/(public)/applications/layout.tsx`                  | `createMetadata(PAGE_SEO.APPLICATIONS)` | Breadcrumb                     |
| `app/(public)/applications/[collectionName]/layout.tsx` | `generateMetadata()` (dynamic)          | Breadcrumb                     |
| `app/(public)/quality/layout.tsx`                       | `createMetadata(PAGE_SEO.QUALITY)`      | Breadcrumb                     |
| `app/(public)/contact/layout.tsx`                       | `createMetadata(PAGE_SEO.CONTACT)`      | Breadcrumb                     |
| `app/(public)/login/layout.tsx`                         | `createMetadata(noIndex: true)`         | —                              |
| `app/robots.ts`                                         | —                                       | robots.txt                     |
| `app/sitemap.ts`                                        | —                                       | sitemap.xml                    |

---

## Configuration

### 1. Site Config (`lib/constants/config.ts`)

```typescript
SITE_CONFIG.URL; // "https://aukra.co.in"
SITE_CONFIG.NAME; // "Aukra Chem Essentials LLP"
SITE_CONFIG.DESCRIPTION; // Primary meta description
SITE_CONFIG.DEFAULT_OG_IMAGE; // "/og-image-default.jpg"
CONTACT_INFO.EMAIL.SUPPORT; // "care@aukra.co.in"
CONTACT_INFO.PHONE; // "+91 8076450898"
SOCIAL_HANDLES; // twitter, linkedin, instagram
VERIFICATION_TOKENS; // Google & Bing verification
```

### 2. Per-Page SEO (`lib/constants/seo.ts`)

All page metadata lives in `PAGE_SEO` — title, description, canonical, keywords per route.

### 3. Verification Tokens

Replace placeholders in `lib/constants/config.ts`:

```typescript
export const VERIFICATION_TOKENS = {
  googleSiteVerification: "YOUR_ACTUAL_TOKEN",
  bingMsvalidate: "YOUR_ACTUAL_TOKEN",
};
```

### 4. OG Image

Place a 1200×630px image at `public/og-image-default.jpg`.

---

## JSON-LD Schemas

| Schema           | Where                                        | Purpose                                          |
| ---------------- | -------------------------------------------- | ------------------------------------------------ |
| `Organization`   | `app/layout.tsx` (global)                    | Company name, logo, contact, social links        |
| `WebSite`        | `app/layout.tsx` (global)                    | Site search action for Google sitelinks          |
| `Product`        | `app/(public)/products/[productId]/page.tsx` | Product name, SKU, brand, category, availability |
| `BreadcrumbList` | All page layouts                             | Navigation trail in search results               |

### Adding a Schema to a New Page

```typescript
import { createBreadcrumbSchema, createMetadata, JsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Page Title",
  description: "Description",
  canonical: "/route",
  keywords: ["keyword1"],
});

export default function Page() {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Page", path: "/route" },
      ])} />
      {/* content */}
    </>
  );
}
```

---

## Sitemap & Robots

### Sitemap (`app/sitemap.ts`)

- **Static**: `/`, `/products`, `/about`, `/applications`, `/quality`, `/contact`
- **Dynamic products**: All products from DB (up to 1000)
- **Dynamic collections**: All application collections from DB
- **Rendering**: `force-dynamic` — always fresh on request

### Robots (`app/robots.ts`)

Disallowed paths: `/api/`, `/admin/`, `/_private/`, `/login`, `/profile`, `/order`

---

## Accessibility

- **Skip link**: `<a href="#main-content">` in `layout.tsx`, styled via `.skip-link` in `globals.css`
- **Semantic HTML**: `<nav>`, `<main>`, `<footer>` with proper `aria-label`
- **ARIA**: `aria-current="page"` on active nav, `aria-label` on icon buttons
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` in `globals.css`
- **Print styles**: `@media print` in `globals.css`

---

## Security Headers (`next.config.mjs`)

| Header                 | Value                           |
| ---------------------- | ------------------------------- |
| X-Content-Type-Options | nosniff                         |
| X-Frame-Options        | DENY                            |
| X-XSS-Protection       | 1; mode=block                   |
| Referrer-Policy        | strict-origin-when-cross-origin |

---

## Testing Checklist

### Metadata

- [ ] Each page has unique `<title>` and `<meta name="description">`
- [ ] `/robots.txt` returns valid rules
- [ ] `/sitemap.xml` lists all static + dynamic routes
- [ ] OG image file exists at `public/og-image-default.jpg` (1200×630px)

### Structured Data

- [ ] [Rich Results Test](https://search.google.com/test/rich-results) — validate homepage, product page
- [ ] Organization schema has name, logo, contact, sameAs
- [ ] Product schema has name, sku, brand, offers

### Performance

- [ ] [Lighthouse](https://pagespeed.web.dev) SEO score ≥ 90
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1

### Social Sharing

- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug) — OG preview correct
- [ ] [LinkedIn Inspector](https://www.linkedin.com/post-inspector) — preview correct

---

## Post-Deployment

1. Submit `https://aukra.co.in/sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
2. Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)
3. Add actual verification tokens to `lib/constants/config.ts`
4. Monitor Coverage report in GSC for indexing errors
5. Track Core Web Vitals in GSC → Web Vitals report

---

## Troubleshooting

| Problem                        | Fix                                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Products not in search results | Verify product schema via Rich Results Test; submit sitemap to GSC; wait 2-4 weeks                         |
| Old OG image on social shares  | Update file, then clear cache via Facebook Debugger / LinkedIn Inspector                                   |
| Metadata not showing           | Ensure `export const metadata` or `export async function generateMetadata` in page/layout; rebuild `.next` |
| Sitemap empty                  | Check DB connection; `getProducts()` / `getCollections()` must return data                                 |
| "Aukra" not ranking            | Brand keywords are in global + per-page keywords; ensure content mentions "Aukra" naturally                |
