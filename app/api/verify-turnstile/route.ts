import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
    }

    // Handle test tokens in development
    if (process.env.NODE_ENV === "development" && token.startsWith("test-token-")) {
      return NextResponse.json({
        success: true,
        error: null,
        challenge_ts: new Date().toISOString(),
        hostname: "localhost",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey || secretKey === "your_turnstile_secret_key") {
      console.warn("Turnstile secret key not configured");
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          success: true,
          error: null,
          challenge_ts: new Date().toISOString(),
          hostname: "localhost",
        });
      }
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch(verifyUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    return NextResponse.json({
      success: result.success,
      error: result["error-codes"] || null,
    });
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
