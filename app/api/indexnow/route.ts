import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY || "8e5b0ca2cb494414b4390325fbef2647";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com";

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow API to notify search engines
 *
 * Body: { urls: string[] } or { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urls = body.urls || (body.url ? [body.url] : []);

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    // Validate URLs belong to our host
    const hostname = new URL(SITE_URL).hostname;
    const invalidUrls = urls.filter((url: string) => {
      try {
        return new URL(url).hostname !== hostname;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      return NextResponse.json(
        { error: "Some URLs don't belong to this host", invalidUrls },
        { status: 422 },
      );
    }

    // Prepare IndexNow payload
    const payload = {
      host: hostname,
      key: INDEXNOW_API_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
      urlList: urls,
    };

    // Submit to IndexNow API
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseData = {
      status: response.status,
      statusText: response.statusText,
      submitted: urls.length,
      urls,
    };

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "URLs submitted successfully to IndexNow",
        ...responseData,
      });
    }

    // Handle error responses
    let errorMessage = "Failed to submit URLs to IndexNow";
    switch (response.status) {
      case 400:
        errorMessage = "Invalid format";
        break;
      case 403:
        errorMessage = "Key not valid (key not found or not in file)";
        break;
      case 422:
        errorMessage = "URLs don't belong to host or key mismatch";
        break;
      case 429:
        errorMessage = "Too many requests (potential spam)";
        break;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...responseData,
      },
      { status: response.status },
    );
  } catch (error) {
    console.error("IndexNow API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/indexnow
 * Test endpoint to verify IndexNow integration
 */
export async function GET() {
  return NextResponse.json({
    message: "IndexNow API endpoint",
    keyFile: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
    usage: "POST with body: { urls: string[] } or { url: string }",
  });
}
