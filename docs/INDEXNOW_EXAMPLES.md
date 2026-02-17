# IndexNow Integration Examples for B2B Panyashaala

This document provides practical examples of how to integrate IndexNow into your existing codebase.

## Example 1: Notify on Product Creation

If you have a product creation API route, add IndexNow notification:

```typescript
// app/api/products/create/route.ts
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        // ... other fields
      },
    });

    // Notify IndexNow (fire-and-forget, don't wait)
    if (process.env.NODE_ENV === "production") {
      submitToIndexNowServer(getFullUrl(`/products/${product.slug}`)).catch((err) =>
        console.error("IndexNow submission failed:", err),
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 },
    );
  }
}
```

## Example 2: Notify on Product Update

```typescript
// app/api/products/[id]/route.ts
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    });

    // Notify search engines about the update
    if (process.env.NODE_ENV === "production") {
      submitToIndexNowServer(getFullUrl(`/products/${product.slug}`)).catch((err) =>
        console.error("IndexNow submission failed:", err),
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product update failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 },
    );
  }
}
```

## Example 3: Server Action (for forms)

```typescript
// app/actions/product-actions.ts
"use server";

import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    const product = await prisma.product.create({
      data: { name, slug /* ... */ },
    });

    // Notify IndexNow
    if (process.env.NODE_ENV === "production") {
      await submitToIndexNowServer(getFullUrl(`/products/${product.slug}`));
    }

    // Revalidate the page
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);

    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}
```

## Example 4: Bulk Submission (after importing products)

```typescript
// app/api/products/bulk-import/route.ts
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    // Bulk create products
    const createdProducts = await prisma.product.createMany({
      data: products,
    });

    // Get all created products with slugs
    const allProducts = await prisma.product.findMany({
      select: { slug: true },
      orderBy: { createdAt: "desc" },
      take: products.length,
    });

    // Notify IndexNow about all new products (max 10,000 URLs per request)
    if (process.env.NODE_ENV === "production") {
      const urls = allProducts.map((p) => getFullUrl(`/products/${p.slug}`));
      submitToIndexNowServer(urls).catch((err) =>
        console.error("IndexNow bulk submission failed:", err),
      );
    }

    return NextResponse.json({
      success: true,
      count: createdProducts.count,
    });
  } catch (error) {
    console.error("Bulk import failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import products" },
      { status: 500 },
    );
  }
}
```

## Example 5: Client-Side Usage (from a React component)

```typescript
// components/admin/ProductForm.tsx
'use client';

import { submitPathnameToIndexNow } from '@/lib/indexnow';
import { useState } from 'react';

export function ProductForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit product data
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* product data */ }),
      });

      const data = await response.json();

      if (data.success) {
        // Notify IndexNow from client
        await submitPathnameToIndexNow(`/products/${data.product.slug}`);
        alert('Product created and submitted to search engines!');
      }
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

## Example 6: Submit sitemap URLs on build

```typescript
// scripts/submit-sitemap-to-indexnow.ts
import { submitToIndexNowServer } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";

async function submitAllProductsToIndexNow() {
  try {
    console.log("Fetching all products...");

    const products = await prisma.product.findMany({
      select: { slug: true },
      where: { published: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
    const urls = products.map((p) => `${baseUrl}/products/${p.slug}`);

    console.log(`Submitting ${urls.length} product URLs to IndexNow...`);

    // Submit in batches of 100 to avoid overwhelming the API
    const batchSize = 100;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      await submitToIndexNowServer(batch);
      console.log(`Submitted batch ${i / batchSize + 1}`);

      // Wait 1 second between batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("All URLs submitted successfully!");
  } catch (error) {
    console.error("Failed to submit URLs:", error);
    process.exit(1);
  }
}

submitAllProductsToIndexNow();
```

Add to `package.json`:

```json
{
  "scripts": {
    "indexnow:submit-all": "tsx scripts/submit-sitemap-to-indexnow.ts"
  }
}
```

## Example 7: Integrate with existing sitemap generation

```typescript
// app/sitemap.ts
import { submitToIndexNowServer } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  // Fetch all products
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    where: { published: true },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Optional: Submit new/updated products to IndexNow
  // (Only do this if you're regenerating sitemap frequently)
  if (process.env.NODE_ENV === "production") {
    const recentlyUpdated = products
      .filter((p) => {
        const daysSinceUpdate = (Date.now() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate < 1; // Updated in last 24 hours
      })
      .map((p) => `${baseUrl}/products/${p.slug}`);

    if (recentlyUpdated.length > 0) {
      submitToIndexNowServer(recentlyUpdated).catch((err) =>
        console.error("IndexNow submission failed:", err),
      );
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...productUrls,
  ];
}
```

## Best Practices for Your Project

1. **Only submit in production**: Always check `NODE_ENV === 'production'` before submitting
2. **Fire-and-forget**: Use `.catch()` to handle errors without blocking the main operation
3. **Submit on meaningful changes**: Only submit when content is created, updated, or published
4. **Batch submissions**: When importing/updating many products, submit in batches
5. **Don't submit on every request**: Only submit when data actually changes

## Testing

1. Test the API endpoint:

```bash
curl -X POST http://localhost:3000/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/products/test"}'
```

2. Verify the key file is accessible:

```bash
curl http://localhost:3000/8e5b0ca2cb494414b4390325fbef2647.txt
```

3. Check in Bing Webmaster Tools after deploying to production

## Important Notes

- **Don't submit in development**: Always check for production environment
- **Rate limits**: IndexNow may throttle excessive submissions (429 error)
- **Verification**: Use Bing Webmaster Tools to verify submissions
- **Patience**: It may take 24-48 hours to see results
