# SEO Implementation - Quick Reference

## 🎯 Key Files & Their Purposes

### Core SEO Module

- **`lib/seo.ts`** - SEO utilities, metadata builders, schema generators

### Route Handlers

- **`app/robots.ts`** - Generate `/robots.txt` for search engines
- **`app/sitemap.ts`** - Generate `/sitemap.xml` with 400+ products

### Page Metadata

- **`app/layout.tsx`** - Global metadata, Organization & Website schemas
- **`app/page.tsx`** - Homepage with metadata & Website schema
- **`app/products/page.tsx`** - Products listing (server component)
- **`app/products/ProductsClient.tsx`** - Products UI (client component)
- **`app/products/[slug]/page.tsx`** - Dynamic product detail pages
- **`app/about/page.tsx`** - About page with metadata
- **`app/contact/layout.tsx`** - Contact page metadata
- **`app/applications/layout.tsx`** - Applications page metadata
- **`app/quality/layout.tsx`** - Quality page metadata

### Enhancements

- **`app/globals.css`** - Accessibility & print styles
- **`components/header.tsx`** - Semantic HTML, skip links, ARIA
- **`components/footer.tsx`** - Semantic HTML, social links
- **`next.config.mjs`** - Security headers, image optimization

### Documentation

- **`README-SEO.md`** - Comprehensive SEO guide
- **`IMPLEMENTATION_SUMMARY.md`** - What was implemented

---

## ⚙️ Configuration Steps

### 1. Update Site Info (lib/seo.ts)

```typescript
export const SITE_URL = "https://aukra.co.in";
export const SITE_NAME = "Your Company";
export const SOCIAL_HANDLES = {
  twitter: "@yourhandle",
  linkedin: "your-company",
  instagram: "@yourhandle",
};
export const VERIFICATION_TOKENS = {
  googleSiteVerification: "YOUR_TOKEN",
  bingMsvalidate: "YOUR_TOKEN",
};
```

### 2. Add OG Images

Create 1200×630px images and place in:

- `public/og-images/og-image-default.jpg`
- Update DEFAULT_OG_IMAGE path in lib/seo.ts if needed

### 3. Get Verification Tokens

- Google Search Console: Settings > Verification → Get HTML tag value
- Bing Webmaster: Settings → Verify ownership

---

## 🔍 Testing Checklist

### Metadata Testing

- [ ] Homepage loads with proper title/description
- [ ] Each page has unique metadata
- [ ] Product pages have dynamic metadata
- [ ] og:image dimensions are 1200×630

### Structured Data Testing

- [ ] Go to [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test homepage URL → Organization & Website schemas valid
- [ ] Test product page → Product schema valid
- [ ] Test category page → Breadcrumb schema valid

### Technical SEO Testing

- [ ] Visit `/robots.txt` → content displays
- [ ] Visit `/sitemap.xml` → XML with 400+ product URLs
- [ ] Lighthouse SEO audit scores 90+
- [ ] Mobile-Friendly Test passes
- [ ] Check Core Web Vitals

### Social Media Testing

- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug) - Check OG preview
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Check card preview
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector) - Check preview

---

## 📱 Dynamic Product URLs

### Before (No SEO)

```
/products → Shows all products
```

### After (SEO-Optimized)

```
/products → Product listing (server component)
/products/lavender-essential-oil-1 → Dynamic product page
/products/jojoba-oil-45 → Another product
/sitemap.xml → Contains all 400+ product URLs
```

---

## 🔗 Metadata Examples

### How to add metadata to a new page:

```typescript
// app/new-page/page.tsx
import { createMetadata, createBreadcrumbSchema, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Page Title",
  description: "Page description for search results",
  canonical: "/new-page",
  keywords: ["keyword1", "keyword2"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Page Name", path: "/new-page" },
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

---

## 📊 Sitemap Structure

```
/sitemap.xml
├── Static Pages (6)
│   ├── / (homepage)
│   ├── /products
│   ├── /about
│   ├── /applications
│   ├── /quality
│   └── /contact
└── Dynamic Products (~400)
    ├── /products/lavender-essential-oil-1
    ├── /products/jojoba-oil-2
    └── ... (up to 400+)
```

**Revalidates**: Every 24 hours automatically

---

## 🤖 JSON-LD Schemas Included

### Organization

- Company name, URL, logo
- Contact point (email, phone)
- Social media links

### Website

- Search action pointing to products
- Enables search box in Google results

### Product (Per Product Page)

- Product name, description, INCI
- Brand name
- Availability status

### Breadcrumb (Category Pages)

- Navigation hierarchy
- Breadcrumb trail in search results

---

## 🚨 Common Issues & Fixes

### Issue: Products not showing in search

**Solution**:

1. Verify product schema in [Rich Results Test](https://search.google.com/test/rich-results)
2. Check robots.txt allows /products/\* paths
3. Submit sitemap to Google Search Console
4. Wait 2-4 weeks for indexing

### Issue: Old OG image showing in social shares

**Solution**:

1. Update image file
2. Clear social cache:
   - Facebook: Use Sharing Debugger
   - LinkedIn: Clear cache manually
   - Twitter: Post URL fresh (can't re-scrape)

### Issue: Sitemap not updating

**Solution**:

1. Verify `/sitemap.xml` returns XML content
2. Check `getProductsData()` returns all products
3. Wait for next ISR revalidation (24 hours)
4. Or manually trigger by visiting product page

### Issue: Metadata not showing

**Solution**:

1. Verify export in page component:
   ```typescript
   export const metadata: Metadata = createMetadata({...});
   ```
2. Rebuild project: `rm -rf .next && npm run build`
3. Clear browser cache
4. Check Next.js version compatibility

---

## 📈 Performance Metrics to Monitor

### Core Web Vitals (Google PageSpeed Insights)

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### SEO Metrics (Google Search Console)

- Impressions (how often your site appears in search)
- Clicks (how often users visit from search)
- Average position (ranking for keywords)
- Coverage (indexed vs not indexed pages)

### Indexing Status

- Total indexed pages (should increase over time)
- Excluded pages (should be minimal)
- Errors (fix promptly)

---

## 🔐 Security Headers Added

- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: XSS attack protection
- **Referrer-Policy**: Controls referrer information

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Schema.org**: https://schema.org/
- **Google Search Central**: https://developers.google.com/search
- **Lighthouse**: Built into Chrome DevTools

---

## ✅ Pre-Deployment Checklist

- [ ] SITE_URL updated to production domain
- [ ] Verification tokens added to lib/seo.ts
- [ ] OG images created and placed (1200×630px)
- [ ] Build succeeds: `npm run build`
- [ ] Lighthouse score 90+
- [ ] Rich Results Test passes
- [ ] Robots.txt works: `/robots.txt`
- [ ] Sitemap works: `/sitemap.xml`
- [ ] Product pages load with metadata
- [ ] Header has skip link
- [ ] Footer has semantic structure

---

## 🚀 Post-Deployment

1. **Submit sitemap to Google Search Console**
   - Go to Sitemaps section
   - Enter: https://aukra.co.in/sitemap.xml
   - Wait for "Success" status

2. **Submit sitemap to Bing Webmaster Tools**
   - Go to Sitemaps section
   - Submit sitemap URL

3. **Monitor Search Console**
   - Check Coverage report for indexing status
   - Fix any errors
   - Monitor Performance for clicks/impressions

4. **Track Core Web Vitals**
   - Use Web Vitals report in GSC
   - Or Google PageSpeed Insights

---

**Implementation Status: COMPLETE** ✅

All 17 SEO enhancements have been implemented and are ready for production deployment.
