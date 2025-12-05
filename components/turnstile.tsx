"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
  testMode?: boolean; // For development/testing
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  theme = "auto",
  size = "normal",
  className = "",
  testMode = false,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Check if we're in development mode
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === "development");
  }, []);

  // Handle test mode or missing keys
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey || siteKey === "your_turnstile_site_key" || testMode) {
      // Mock Turnstile behavior for development/testing
      const timer = setTimeout(() => {
        const mockToken = "test-token-" + Date.now();
        onVerify(mockToken);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [onVerify, testMode]);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    // Skip loading script if in test mode or no key
    if (!siteKey || siteKey === "your_turnstile_site_key" || testMode) {
      return;
    }

    // Load Turnstile script
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setError("Failed to load Turnstile verification system");
      };

      document.head.appendChild(script);
    } else if (window.turnstile) {
      setIsLoaded(true);
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch (err) {
          console.warn("Error removing Turnstile widget:", err);
        }
      }
    };
  }, [testMode]);

  useEffect(() => {
    if (
      isLoaded &&
      containerRef.current &&
      window.turnstile &&
      !widgetId.current
    ) {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

      if (!siteKey || siteKey === "your_turnstile_site_key") {
        setError(
          "Turnstile site key is not configured in environment variables"
        );
        return;
      }

      try {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token: string) => {
            setError(null);
            onVerify(token);
          },
          "error-callback": (errorCode?: string) => {
            const errorMessage = getErrorMessage(errorCode);
            setError(errorMessage);
            onError?.();
          },
          "expired-callback": () => {
            setError("Security verification expired. Please verify again.");
            onExpire?.();
          },
          "timeout-callback": () => {
            setError("Verification timed out. Please try again.");
            onError?.();
          },
        }) as string | null;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to initialize security verification: ${errorMsg}`);
        console.error("Turnstile initialization error:", err);
      }
    }
  }, [isLoaded, theme, size, onVerify, onError, onExpire]);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case "network-error":
        return "Network error. Please check your internet connection.";
      case "parse-error":
        return "Configuration error. Please contact support.";
      case "config-error":
        return "Invalid configuration. Please contact support.";
      case "generic-client-error":
        return "Verification failed. Please try again.";
      default:
        return "Security verification failed. Please try again.";
    }
  };

  const reset = () => {
    if (widgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current);
        setError(null);
      } catch (err) {
        console.warn("Error resetting Turnstile widget:", err);
      }
    }
  };

  // Show different UI based on configuration
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isTestMode =
    testMode || !siteKey || siteKey === "your_turnstile_site_key";

  if (error) {
    return (
      <div className={`text-destructive text-sm ${className}`}>
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="font-medium">Security Verification Error</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            type="button"
            onClick={reset}
            className="text-primary hover:underline text-xs mt-2 block"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Development/Test mode - show mock verification
  if (isTestMode) {
    return (
      <div className={`${className}`}>
        <div className="p-4 bg-muted/50 border-2 border-dashed border-border rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-2">
            🔧 Development Mode - Mock Verification
          </div>
          <div className="text-xs text-muted-foreground">
            {isDevelopment ? (
              <>
                Turnstile verification is disabled in development.
                <br />
                Configure NEXT_PUBLIC_TURNSTILE_SITE_KEY for production.
              </>
            ) : (
              "Test mode enabled - verification will be bypassed"
            )}
          </div>
          <div className="mt-2 text-green-600 text-xs">
            ✓ Verification Complete (Mock)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={containerRef} />
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 bg-muted rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
          <span className="text-sm text-muted-foreground">
            Loading verification...
          </span>
        </div>
      )}
    </div>
  );
}
