# SEO Implementation Guide

Comprehensive SEO setup for B2B Cosmetic Ingredients supplier website using Next.js 16 App Router, Metadata API, and structured data.

## Overview

This implementation includes:

- **Metadata API**: Comprehensive metadata configuration with OpenGraph, Twitter cards, robots directives
- **Dynamic Sitemap**: Auto-generated sitemap with ~400+ products and static pages
- **Robots.txt**: Crawling rules and sitemap reference
- **Structured Data**: JSON-LD schemas for Organization, Website, Product, and Breadcrumb
- **Dynamic Product Routes**: Server-side rendering with ISR for product detail pages
- **Per-Page Metadata**: Custom metadata for each route
- **Image Optimization**: Next.js Image component with proper sizing
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Configuration

### Site Configuration (lib/seo.ts)

Customize the SEO utilities file with your site-specific information:

```typescript
export const SITE_URL = "https://aukra.co.in"; // Production domain
export const SITE_NAME = "B2B Cosmetic Ingredients";
export const SITE_DESCRIPTION = "..."; // Update description

export const SOCIAL_HANDLES = {
  twitter: "@yourtwitterhandle",
  linkedin: "your-linkedin-company",
  instagram: "@yourinstagram",
};

export const VERIFICATION_TOKENS = {
  googleSiteVerification: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  bingMsvalidate: "YOUR_BING_VERIFICATION_TOKEN",
};
```

### Environment Variables (Optional)

Create `.env.local` for environment-specific configuration:

```env
NEXT_PUBLIC_SITE_URL=https://aukra.co.in
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_token
NEXT_PUBLIC_BING_MSVALIDATE=your_token
```

## File Structure

```
app/
├── layout.tsx                 # Root layout with global metadata
├── robots.ts                  # Robots.txt generation
├── sitemap.ts                 # Dynamic sitemap generation
├── page.tsx                   # Home page with metadata
├── about/
│   └── page.tsx              # About page with metadata
├── applications/
│   ├── layout.tsx            # Layout with metadata
│   └── page.tsx              # Applications page
├── contact/
│   ├── layout.tsx            # Layout with metadata
│   └── page.tsx              # Contact page
├── quality/
│   ├── layout.tsx            # Layout with metadata
│   └── page.tsx              # Quality page
├── products/
│   ├── page.tsx              # Products listing (server component)
│   ├── ProductsClient.tsx    # Products client component
│   └── [slug]/
│       └── page.tsx          # Dynamic product detail page
└── globals.css               # Global styles + accessibility

lib/
├── seo.ts                     # SEO utilities and helpers
├── productData.ts            # Product data
└── store.ts                  # Zustand store

components/
├── header.tsx                # Enhanced with semantics
└── footer.tsx                # Enhanced with structured data
```

## Metadata Customization

### Using createMetadata Helper

```typescript
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Page Title",
  description: "Page description",
  canonical: "/page-path",
  image: "/og-image.jpg",
  type: "website", // or 'product', 'article'
  keywords: ["keyword1", "keyword2"],
  noIndex: false, // Set true to prevent indexing
});
```

### Adding Page-Specific Metadata

Example for a new page:

```typescript
// app/new-page/page.tsx
import { createMetadata, createBreadcrumbSchema, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Page Title | Site Name",
  description: "Unique page description for SEO",
  canonical: "/new-page",
  keywords: ["relevant", "keywords", "for", "page"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "New Page", path: "/new-page" },
];

export default function NewPage() {
  return (
    <>
      <JsonLd schema={createBreadcrumbSchema(breadcrumbs)} />
      {/* Page content */}
    </>
  );
}
```

## JSON-LD Structured Data

### Organization Schema

Automatically included in root layout. Update contact information in `lib/seo.ts`:

```typescript
export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: getAbsoluteUrl("/logo-text.svg"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@yourdomain.com", // Update
      telephone: "+1-800-000-0000", // Update
    },
    sameAs: [
      /* social links */
    ],
  };
}
```

### Product Schema

Automatically generated for dynamic product pages. Customize in `createProductSchema()`:

```typescript
export function createProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.description} INCI: ${product.inci}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.category,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
}
```

### Breadcrumb Schema

Used on category and product pages:

```typescript
<JsonLd
  schema={createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Product Name", path: "/products/product-slug-123" },
  ])}
/>
```

### Adding New Schema Types

Example: Adding FAQ schema

```typescript
// In lib/seo.ts
export function createFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// In page.tsx
<JsonLd schema={createFAQSchema(faqList)} />;
```

## Open Graph & Social Media

### OG Images

Store Open Graph images in `public/og-images/`:

- **Dimensions**: 1200×630px (recommended for optimal display)
- **Aspect Ratio**: 1.91:1
- **Format**: JPG or PNG
- **Size**: < 5MB for best performance

### Image Naming Convention

```
public/og-images/
├── og-image-default.jpg      # Homepage, fallback
├── og-image-products.jpg     # Products page
├── og-image-about.jpg        # About page
└── og-image-product-[id].jpg # Product-specific
```

### Social Meta Tags

Automatically handled by `createMetadata()`. Customize handles in `lib/seo.ts`:

```typescript
export const SOCIAL_HANDLES = {
  twitter: "@cosmeticsupply",
  linkedin: "b2b-cosmetics",
  instagram: "@cosmeticsupply",
};
```

## Dynamic Product Pages

### How They Work

1. **Build Time**: `generateStaticParams()` generates static routes for all products
2. **Request Time**: `generateMetadata()` generates product-specific metadata
3. **ISR**: Pages revalidate every hour to reflect product updates
4. **Fallback**: Dynamic pages generate on-demand if new products added

### Customizing Product Metadata

Edit `app/products/[slug]/page.tsx` `generateMetadata()` function:

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productId = parseProductSlug(slug);
  const products = getProductsData();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return createMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      canonical: "/products",
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${product.name} | Category`,
    description: `${product.description} INCI: ${product.inci}. Applications: ${product.applications}.`,
    canonical: `/products/${slug}`,
    keywords: [product.name, product.inci, ...product.applications.split(",")],
  });
}
```

## Core Web Vitals Optimization

### Image Optimization

Use `next/image` with proper sizing:

```typescript
import Image from "next/image";

<Image
  src="image.jpg"
  alt="Descriptive alt text"
  width={600}
  height={400}
  priority={true} // Only for above-the-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>;
```

### Font Optimization

Font display swap configured in `app/layout.tsx`:

```typescript
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap", // Shows fallback while loading
});
```

### CSS Optimization

Global styles include:

- Reduced motion preferences
- Focus visible states for accessibility
- Print styles

## Testing & Validation

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for your domain
3. Submit sitemap: `https://aukra.co.in/sitemap.xml`
4. Verify site ownership using meta tag from `lib/seo.ts`

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify using meta tag
4. Submit sitemap

### Lighthouse SEO Audit

Run Chrome DevTools Lighthouse:

- Target: 90+ SEO score
- Check: Mobile-Friendly, Accessibility, Best Practices
- Monitor: Core Web Vitals (LCP, FID, CLS)

### Rich Results Test

Test structured data:

1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)

Enter your URLs to validate Product, Organization, and Breadcrumb schemas.

### Mobile-Friendly Test

[Google Mobile-Friendly Test](https://search.google.com/mobile-friendly-test)

Ensure all pages are mobile optimized.

### PageSpeed Insights

[Google PageSpeed Insights](https://pagespeed.web.dev/)

Monitor Core Web Vitals:

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Open Graph Debugger

Test social media previews:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Deployment Checklist

Before going to production:

### Configuration

- [ ] Update `SITE_URL` in `lib/seo.ts` to production domain
- [ ] Update `SITE_NAME` and `SITE_DESCRIPTION`
- [ ] Update social media handles
- [ ] Update contact information (email, phone)
- [ ] Add Google Search Console verification token
- [ ] Add Bing Webmaster Tools verification token

### Content

- [ ] Create OG images (1200×630px) for homepage and key pages
- [ ] Place images in `public/og-images/`
- [ ] Update product descriptions for SEO
- [ ] Ensure all pages have unique titles and descriptions

### Technical

- [ ] Run Lighthouse audit (target 90+ SEO score)
- [ ] Test robots.txt at `/robots.txt`
- [ ] Validate sitemap at `/sitemap.xml`
- [ ] Test Rich Results for Product and Organization schemas
- [ ] Verify OpenGraph tags with social debuggers
- [ ] Test mobile responsiveness

### Search Engine Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request indexing for homepage
- [ ] Monitor crawl errors in GSC
- [ ] Set up performance monitoring

### Analytics

- [ ] Set up Google Analytics 4
- [ ] Configure Goal tracking (Contact form, Product views)
- [ ] Set up Conversion tracking
- [ ] Monitor Core Web Vitals with Web Vitals report
- [ ] Track organic search traffic

### Ongoing Maintenance

- [ ] Monitor GSC for new error types
- [ ] Review crawl stats monthly
- [ ] Check Core Web Vitals monthly
- [ ] Update product metadata when inventory changes
- [ ] Add new pages and update sitemap
- [ ] Monitor rankings for target keywords

## ISR & Caching Strategies

### Revalidation Times

- **Homepage**: Dynamic (caches aggressively)
- **Product Listing**: Dynamic (caches aggressively)
- **Product Detail Pages**: 1 hour (ISR)
- **Sitemap**: 24 hours (ISR)
- **Static Pages**: Default Next.js caching

### Invalidating Cache

After updating product data:

```bash
# For ISR, simply revalidate in background
# Next.js will regenerate pages when they're visited

# Manual revalidation via API route (if implemented):
POST /api/revalidate?secret=YOUR_SECRET&paths=/sitemap.xml,/products
```

## Accessibility & Semantics

### Semantic HTML

All pages use semantic HTML:

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy (H1, H2, H3)
- `<figure>`, `<figcaption>` for images
- `<dl>`, `<dt>`, `<dd>` for definitions

### ARIA Attributes

- Navigation: `<nav aria-label="Main navigation">`
- Mobile menu: `aria-expanded`, `aria-controls`
- Social icons: `aria-label="Follow us on Twitter"`
- Buttons: `aria-label` for icon-only buttons

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus visible states styled in `globals.css`
- Tab order follows logical flow

### Color Contrast

- Text: WCAG AA compliance (4.5:1 minimum)
- UI Components: WCAG AA compliance (3:1 minimum)

## Performance Optimization

### Code Splitting

- Products page uses client component split
- ProductsClient.tsx isolated for better caching
- Dynamic imports for heavy components

### Image Optimization

- Using Next.js Image component
- Responsive sizes attribute
- Lazy loading for below-the-fold images
- WebP format with fallbacks

### Font Optimization

- `font-display: swap` for critical fonts
- Preload fonts in layout.tsx
- Subset: Latin characters only

### Build Optimization

- `swcMinify: true` for SWC minification
- Production builds optimized for size
- Tree shaking enabled

## Troubleshooting

### Products Not Showing in Search Results

**Issue**: Products indexed but not ranking

**Solution**:

1. Verify product schema with Rich Results Test
2. Check for `noIndex` being set accidentally
3. Ensure product pages are crawlable (`robots.txt`)
4. Request indexing in Google Search Console
5. Wait 2-4 weeks for indexing

### Metadata Not Updating

**Issue**: Old metadata visible in social shares

**Solution**:

1. Verify metadata export in page file
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild and redeploy
4. Clear social media cache:
   - Facebook: Use Sharing Debugger with "Scrape Again"
   - Twitter: Post URL fresh (can't re-scrape)
   - LinkedIn: Clear cache manually

### Sitemap Generation Issues

**Issue**: Sitemap empty or not updating

**Solution**:

1. Verify `getProductsData()` returns products
2. Check ISR revalidate time
3. Manually trigger revalidate with page request
4. Check build logs for errors
5. Validate sitemap structure at `/sitemap.xml`

### Robots.txt Not Working

**Issue**: Pages being crawled when blocked

**Solution**:

1. Verify `app/robots.ts` exists
2. Check robots.txt at `/robots.txt`
3. Allow time for crawlers to re-read (24-48 hours)
4. Submit updated robots.txt to Google Search Console

## Advanced Topics

### Custom Headers for SEO

Next.js can add custom headers for security (already configured if using default headers):

```typescript
// next.config.mjs
export async function headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ];
}
```

### Canonical URLs

Already handled by `createMetadata()`. For dynamic content:

```typescript
return createMetadata({
  canonical: `/products/${slug}`,
  // Automatically creates:
  // <link rel="canonical" href="https://domain.com/products/slug" />
});
```

### Hreflang Tags (Multi-language)

For future international expansion:

```typescript
alternates: {
  canonical: SITE_URL + path,
  languages: {
    es: SITE_URL + '/es' + path,
    fr: SITE_URL + '/fr' + path,
  },
}
```

## Resources

### Documentation

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Robots and Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/robots)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### Tools

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/mobile-friendly-test)

### SEO Best Practices

- Focus on user experience (Core Web Vitals)
- Create unique, valuable content
- Build quality backlinks
- Fix crawl errors promptly
- Keep schema up-to-date
- Monitor rankings and adjust strategy

## Support & Questions

For issues or questions:

1. Check this guide first
2. Review Next.js documentation
3. Test with provided tools
4. Check build logs for errors
5. Consult SEO best practices resources
