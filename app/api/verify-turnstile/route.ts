import { ERROR_MESSAGES, HTTP_STATUS, TURNSTILE_CONFIG } from "@/lib/constants";
import { captureException } from "@/lib/sentry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.VALIDATION.TOKEN_REQUIRED },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    // Handle test tokens in development
    if (
      process.env.NODE_ENV === "development" &&
      token.startsWith(TURNSTILE_CONFIG.TEST_TOKEN_PREFIX)
    ) {
      return NextResponse.json({
        success: true,
        error: null,
        challenge_ts: new Date().toISOString(),
        hostname: "localhost",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey || secretKey === TURNSTILE_CONFIG.PLACEHOLDER_SECRET) {
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
        { success: false, error: ERROR_MESSAGES.TURNSTILE.SERVER_CONFIG_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }

    const verifyUrl = TURNSTILE_CONFIG.VERIFY_URL;
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
    captureException(error, {
      tags: { layer: "api", action: "verify-turnstile" },
    });
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.TURNSTILE.VERIFICATION_FAILED },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}
