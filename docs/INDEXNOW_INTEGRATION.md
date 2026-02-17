# IndexNow Integration Guide

## Overview

IndexNow is integrated into this project to instantly notify search engines (Bing, Yandex, etc.) when content is updated.

## Setup

### 1. API Key

The API key is: `8e5b0ca2cb494414b4390325fbef2647`

This key is hosted at: `https://your-domain.com/8e5b0ca2cb494414b4390325fbef2647.txt`

### 2. Environment Variables

Add to your `.env.local`:

```env
INDEXNOW_API_KEY=8e5b0ca2cb494414b4390325fbef2647
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

### 3. Verification

Use [Bing Webmaster Tools](https://www.bing.com/webmasters) to verify if your URLs are being received.

## Usage

### Client-Side Usage

```typescript
import {
  submitUrlToIndexNow,
  submitUrlsToIndexNow,
  submitPathnameToIndexNow,
} from "@/lib/indexnow";

// Submit a single URL
await submitUrlToIndexNow("https://example.com/products/new-product");

// Submit multiple URLs
await submitUrlsToIndexNow([
  "https://example.com/products/product-1",
  "https://example.com/products/product-2",
]);

// Submit using pathname (easier)
await submitPathnameToIndexNow("/products/new-product");
```

### Server-Side Usage (API Routes, Server Actions)

```typescript
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";

// In an API route or Server Action
export async function POST(request: Request) {
  // ... create/update product logic ...

  // Notify IndexNow
  const productUrl = getFullUrl(`/products/${productSlug}`);
  await submitToIndexNowServer(productUrl);

  return Response.json({ success: true });
}
```

### Example: Notify on Product Creation

```typescript
// In your product creation API route
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";

export async function POST(request: Request) {
  const data = await request.json();

  // Create product in database
  const product = await prisma.product.create({ data });

  // Notify search engines
  const productUrl = getFullUrl(`/products/${product.slug}`);
  await submitToIndexNowServer(productUrl);

  return Response.json({ success: true, product });
}
```

### Example: Notify on Product Update

```typescript
// In your product update API route
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";

export async function PATCH(request: Request) {
  const data = await request.json();

  // Update product
  const product = await prisma.product.update({
    where: { id: data.id },
    data,
  });

  // Notify search engines about the update
  await submitToIndexNowServer(getFullUrl(`/products/${product.slug}`));

  return Response.json({ success: true, product });
}
```

### Bulk Submission Example

```typescript
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";

// Submit all product URLs at once
const products = await prisma.product.findMany();
const urls = products.map((p) => getFullUrl(`/products/${p.slug}`));
await submitToIndexNowServer(urls);
```

## API Endpoints

### POST /api/indexnow

Submit URLs to IndexNow

**Request Body:**

```json
{
  "url": "https://example.com/page"
}
```

or for multiple URLs:

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "URLs submitted successfully to IndexNow",
  "status": 200,
  "submitted": 1,
  "urls": ["https://example.com/page"]
}
```

### GET /api/indexnow

Test endpoint to verify configuration

## Response Codes

- **200 OK**: URL submitted successfully
- **400 Bad Request**: Invalid format
- **403 Forbidden**: Key not valid (key not found or not in file)
- **422 Unprocessable Entity**: URLs don't belong to host or key mismatch
- **429 Too Many Requests**: Too many requests (potential spam)

## When to Submit URLs

Submit URLs to IndexNow when:

- ✅ Creating new content (products, blog posts, pages)
- ✅ Updating existing content
- ✅ Publishing previously unpublished content
- ❌ Don't submit for minor changes (typo fixes, etc.)
- ❌ Don't submit deleted pages

## Best Practices

1. **Submit immediately after publishing**: Call IndexNow right after creating/updating content
2. **Batch similar updates**: If updating multiple items, submit them in bulk (max 10,000 URLs per request)
3. **Don't over-submit**: Only submit when content meaningfully changes
4. **Monitor in Bing Webmaster Tools**: Check if submissions are being accepted

## Troubleshooting

### Key file not accessible

Ensure `public/8e5b0ca2cb494414b4390325fbef2647.txt` exists and is publicly accessible at:
`https://your-domain.com/8e5b0ca2cb494414b4390325fbef2647.txt`

### 403 Forbidden Error

- Verify the key file contains exactly: `8e5b0ca2cb494414b4390325fbef2647`
- Ensure the file is UTF-8 encoded
- Check that `INDEXNOW_API_KEY` environment variable matches

### URLs not being indexed

- Verify in Bing Webmaster Tools
- Ensure URLs are publicly accessible
- Check that URLs belong to your domain
- Wait 24-48 hours for processing

## Resources

- [IndexNow Documentation](https://www.indexnow.org/documentation)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow FAQ](https://www.indexnow.org/faq)
