import ImageKit from "@imagekit/nodejs";

/**
 * ImageKit Client Singleton
 * =========================
 * Server-side only. Used for uploading, deleting, and managing
 * images on ImageKit.io CDN.
 */

function createImageKitClient(): ImageKit {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY. Set it in your environment variables.");
  }

  return new ImageKit({ privateKey });
}

// Lazy singleton — created on first access, reused across requests
let _client: ImageKit | null = null;

export function getImageKitClient(): ImageKit {
  if (!_client) {
    _client = createImageKitClient();
  }
  return _client;
}
