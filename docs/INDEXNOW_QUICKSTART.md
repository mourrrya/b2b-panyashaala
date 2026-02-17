# IndexNow Integration - Quick Start

## ✅ What's Been Set Up

1. **API Key File**: `public/8e5b0ca2cb494414b4390325fbef2647.txt`
2. **API Route**: `/api/indexnow` - for submitting URLs
3. **Utility Functions**: `lib/indexnow.ts` - helper functions
4. **Documentation**:
   - `docs/INDEXNOW_INTEGRATION.md` - Complete guide
   - `docs/INDEXNOW_EXAMPLES.md` - Practical examples

## 🚀 Next Steps

### 1. Add Environment Variables

Add these to your `.env.local` file:

```env
INDEXNOW_API_KEY=8e5b0ca2cb494414b4390325fbef2647
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

> **Important**: Replace `https://your-production-domain.com` with your actual domain!

### 2. Verify the Key File is Accessible

After deploying, visit:

```
https://your-domain.com/8e5b0ca2cb494414b4390325fbef2647.txt
```

You should see: `8e5b0ca2cb494414b4390325fbef2647`

### 3. Test the API (Optional)

Test locally:

```bash
curl -X POST http://localhost:3000/api/indexnow \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://your-domain.com/products/test\"}"
```

### 4. Integrate into Your Code

Choose where to add IndexNow notifications:

**Option A: Server-Side (Recommended)**

```typescript
import { submitToIndexNowServer, getFullUrl } from "@/lib/indexnow";

// In your API route or Server Action
const product = await prisma.product.create({ data });

// Notify IndexNow (production only)
if (process.env.NODE_ENV === "production") {
  submitToIndexNowServer(getFullUrl(`/products/${product.slug}`)).catch((err) =>
    console.error("IndexNow failed:", err),
  );
}
```

**Option B: Client-Side**

```typescript
import { submitPathnameToIndexNow } from "@/lib/indexnow";

await submitPathnameToIndexNow(`/products/${productSlug}`);
```

### 5. Register with Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your website
3. Verify ownership
4. Monitor IndexNow submissions in the dashboard

## 📝 Common Use Cases

### When Creating a Product

```typescript
const product = await prisma.product.create({ data });
await submitToIndexNowServer(getFullUrl(`/products/${product.slug}`));
```

### When Updating a Product

```typescript
const product = await prisma.product.update({ where: { id }, data });
await submitToIndexNowServer(getFullUrl(`/products/${product.slug}`));
```

### When Publishing Multiple Products

```typescript
const products = await prisma.product.findMany();
const urls = products.map((p) => getFullUrl(`/products/${p.slug}`));
await submitToIndexNowServer(urls);
```

## ⚠️ Important Notes

- **Production Only**: Always check `NODE_ENV === 'production'` before submitting
- **Fire and Forget**: Use `.catch()` to prevent blocking on errors
- **Don't Over-Submit**: Only submit when content meaningfully changes
- **Batch Limit**: Max 10,000 URLs per request
- **Rate Limits**: Too many requests will result in 429 errors

## 📚 Full Documentation

- **Integration Guide**: `docs/INDEXNOW_INTEGRATION.md`
- **Code Examples**: `docs/INDEXNOW_EXAMPLES.md`

## 🔍 Verification

After deployment:

1. ✅ Key file accessible at `https://your-domain.com/8e5b0ca2cb494414b4390325fbef2647.txt`
2. ✅ Environment variables set correctly
3. ✅ API endpoint works: `POST /api/indexnow`
4. ✅ Bing Webmaster Tools showing submissions

## 🆘 Troubleshooting

**403 Forbidden Error**

- Check key file exists and is accessible
- Verify key matches exactly in `.env.local`

**422 Unprocessable Entity**

- URLs must belong to your domain
- Check `NEXT_PUBLIC_SITE_URL` is correct

**429 Too Many Requests**

- You're submitting too frequently
- Implement rate limiting or batching

---

**You're all set!** 🎉

IndexNow is now integrated. Just add the environment variables and start notifying search engines when you create/update content.
