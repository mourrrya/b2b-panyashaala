/**
 * IndexNow Utility
 * Helper functions to submit URLs to IndexNow API
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com";

export interface IndexNowResponse {
  success: boolean;
  error?: string;
  message?: string;
  status?: number;
  submitted?: number;
  urls?: string[];
}

/**
 * Submit a single URL to IndexNow
 * @param url - The full URL to submit (e.g., "https://example.com/product/123")
 */
export async function submitUrlToIndexNow(url: string): Promise<IndexNowResponse> {
  try {
    const response = await fetch("/api/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    return await response.json();
  } catch (error) {
    console.error("Failed to submit URL to IndexNow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Submit multiple URLs to IndexNow in bulk
 * @param urls - Array of full URLs to submit
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  try {
    const response = await fetch("/api/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
    });

    return await response.json();
  } catch (error) {
    console.error("Failed to submit URLs to IndexNow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Helper to construct full URL from pathname
 * @param pathname - The path (e.g., "/products/essential-oils")
 */
export function getFullUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/**
 * Submit a pathname to IndexNow (will be converted to full URL)
 * @param pathname - The path (e.g., "/products/essential-oils")
 */
export async function submitPathnameToIndexNow(pathname: string): Promise<IndexNowResponse> {
  const fullUrl = getFullUrl(pathname);
  return submitUrlToIndexNow(fullUrl);
}

/**
 * Submit multiple pathnames to IndexNow (will be converted to full URLs)
 * @param pathnames - Array of paths
 */
export async function submitPathnamestoIndexNow(pathnames: string[]): Promise<IndexNowResponse> {
  const fullUrls = pathnames.map(getFullUrl);
  return submitUrlsToIndexNow(fullUrls);
}

/**
 * Server-side function to submit URLs to IndexNow
 * Use this in API routes or server components
 */
export async function submitToIndexNowServer(urls: string | string[]): Promise<IndexNowResponse> {
  const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY || "8e5b0ca2cb494414b4390325fbef2647";
  const urlList = Array.isArray(urls) ? urls : [urls];

  try {
    const hostname = new URL(SITE_URL).hostname;

    const payload = {
      host: hostname,
      key: INDEXNOW_API_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
      urlList,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return {
        success: true,
        message: "URLs submitted successfully",
        submitted: urlList.length,
        urls: urlList,
      };
    }

    return {
      success: false,
      error: response.statusText,
      status: response.status,
    };
  } catch (error) {
    console.error("Failed to submit to IndexNow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
