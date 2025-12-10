"use client";

import { useStore } from "@/lib/store";
import { useEffect } from "react";

const CACHE_KEY = "products_cache";
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

interface CacheData {
  products: any[];
  timestamp: number;
}

export function ProductDataProvider() {
  const { products, setProducts, setLoadingProducts, setProductsError } =
    useStore();

  useEffect(() => {
    // Only fetch if we don't have products yet
    if (products.length === 0) {
      loadProducts();
    }
  }, [products.length, setProducts]);

  const loadProducts = async () => {
    // Try to load from cache first
    const cachedData = loadFromCache();
    if (cachedData) {
      setProducts(cachedData);
      return;
    }

    // If no cache, fetch from API
    await fetchProducts();
  };

  const fetchProducts = async (retryCount = 0) => {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to match current Product interface
      const transformedProducts = data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: mapCategoryToUI(product.category),
        description: product.description || "",
        inci: generateINCI(product),
        applications: generateApplications(product),
      }));

      setProducts(transformedProducts);

      // Cache the transformed products
      saveToCache(transformedProducts);

      setLoadingProducts(false);
    } catch (error) {
      console.error("Error fetching products:", error);

      // Retry logic (up to 3 times)
      if (retryCount < 3) {
        console.log(`Retrying fetch... (${retryCount + 1}/3)`);
        setTimeout(
          () => fetchProducts(retryCount + 1),
          1000 * (retryCount + 1)
        );
        return;
      }

      setProductsError("Failed to load products. Please refresh the page.");
      setLoadingProducts(false);
    }
  };

  const loadFromCache = (): any[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      console.log("Loading products from cache");
      return cacheData.products;
    } catch (error) {
      console.error("Error loading from cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const saveToCache = (products: any[]) => {
    try {
      const cacheData: CacheData = {
        products,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log("Products cached successfully");
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  // Map Prisma enum to UI category
  const mapCategoryToUI = (category: string): string => {
    const categoryMap: Record<string, string> = {
      ESSENTIAL_OIL: "essential-oil",
      FIXED_OIL: "fixed-oil",
      EXTRACT: "extract",
      HYDROSOL: "hydrosol",
      HERBAL_OILS: "herbal-oils",
      CHEMICALS: "chemicals",
    };
    return categoryMap[category] || category.toLowerCase().replace("_", "-");
  };

  // Generate INCI name from product data
  const generateINCI = (product: any): string => {
    if (product.botanicalName) {
      return product.botanicalName;
    }
    // Fallback to name if no botanical name
    return product.name;
  };

  // Generate applications from variants
  const generateApplications = (product: any): string => {
    if (product.variants && product.variants.length > 0) {
      const applications = product.variants
        .map((variant: any) => variant.usage || variant.description || "")
        .filter((app: string) => app.length > 0)
        .join(", ");
      return applications || "Various cosmetic applications";
    }
    return "Various cosmetic applications";
  };

  return null; // This component doesn't render anything
}
