import { getCollections } from "@/app/api/services/collectionServices";
import { getProducts } from "@/app/api/services/productServices";
import { PUBLIC_NAV } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";

// Force dynamic rendering so the sitemap is not pre-rendered at build time
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}${PUBLIC_NAV.PRODUCTS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${PUBLIC_NAV.ABOUT}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}${PUBLIC_NAV.APPLICATIONS}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${PUBLIC_NAV.QUALITY}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}${PUBLIC_NAV.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { products } = await getProducts({ limit: 1000, page: 1 });
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}${PUBLIC_NAV.PRODUCT_DETAIL(product.id)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.warn("Sitemap: Failed to fetch products, returning static routes only.", error);
  }

  // Dynamic collection/application routes
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await getCollections();
    collectionRoutes = collections.map((collection) => ({
      url: `${SITE_URL}/applications/${encodeURIComponent(collection.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.warn("Sitemap: Failed to fetch collections.", error);
  }

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
