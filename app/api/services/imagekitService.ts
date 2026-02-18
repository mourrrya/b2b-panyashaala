import { ErrorInvalidRequest, ErrorUnknown } from "@/lib/backend/errorHandler";
import { getImageKitClient } from "@/lib/backend/imagekit";
import { ERROR_MESSAGES } from "@/lib/constants";
import { toFile } from "@imagekit/nodejs";
import { AssetListResponse } from "@imagekit/nodejs/resources/assets.mjs";

// =============================================================================
// CONSTANTS
// =============================================================================

const AVATAR_FOLDER = process.env.NODE_ENV === "production" ? "/avatars" : "/dev-avatars";
const AVATAR_MAX_SIZE = 200 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

// =============================================================================
// TYPES
// =============================================================================

export interface AvatarUploadResult {
  url: string;
  fileId: string;
  filePath: string;
}

// =============================================================================
// UPLOAD AVATAR
// =============================================================================

/**
 * Uploads a user avatar to ImageKit and returns the CDN URL.
 *
 * - Validates file type and size before uploading.
 * - Uses `useUniqueFileName: false` so re-uploads overwrite the previous avatar.
 * - Files are stored under `/avatars/{userId}.{ext}`.
 *
 * @param userId  — authenticated user ID (used as file name for idempotency)
 * @param buffer  — raw file bytes
 * @param mimeType — e.g. "image/png"
 * @param originalName — original file name from the client
 */
export async function uploadAvatar(
  userId: string,
  buffer: Buffer,
  mimeType: string,
  originalName: string,
): Promise<AvatarUploadResult> {
  const ext = MIME_TO_EXT[mimeType];
  if (!ext) throw new ErrorInvalidRequest(ERROR_MESSAGES.FILE.INVALID_TYPE);
  if (buffer.length > AVATAR_MAX_SIZE)
    throw new ErrorInvalidRequest(ERROR_MESSAGES.FILE.SIZE_EXCEEDED);

  const client = getImageKitClient();

  try {
    const fileName = `${userId}.${ext}`;

    // delete previous avatars (best-effort)
    const previous = await listUserAvatarFileIds(client, userId);
    if (previous.length) await deleteFilesByIds(client, previous);

    const file = await toFile(buffer, originalName, { type: mimeType });
    const response = await client.files.upload({
      file,
      fileName,
      folder: AVATAR_FOLDER,
      useUniqueFileName: false,
      tags: ["avatar", `user:${userId}`],
    });

    if (!response.url) throw new Error("ImageKit upload returned no URL");
    return {
      url: `${response.url}?v=${Date.now()}`,
      fileId: response.fileId ?? "",
      filePath: response.filePath ?? "",
    };
  } catch (err) {
    if (err instanceof ErrorInvalidRequest) throw err;
    throw new ErrorUnknown(ERROR_MESSAGES.FILE.UPLOAD_FAILED);
  }
}

// =============================================================================
// DELETE AVATAR
// =============================================================================

/**
 * Deletes a previously uploaded avatar from ImageKit by fileId.
 * Fails silently — avatar deletion is best-effort.
 */
export async function deleteAvatar(fileId: string): Promise<void> {
  if (!fileId) return;

  try {
    const client = getImageKitClient();
    await client.files.delete(fileId);
  } catch {
    // Best-effort: log but don't throw
    console.warn(`[ImageKit] Failed to delete avatar fileId=${fileId}`);
  }
}

// Helpers
async function listUserAvatarFileIds(
  client: ReturnType<typeof getImageKitClient>,
  userId: string,
): Promise<string[]> {
  try {
    const res: AssetListResponse = await client.assets.list({
      path: AVATAR_FOLDER,
    });

    const fileIds: string[] = [];
    res.forEach((f) => {
      const userFileId = f.name?.split(".")[0];
      if (f.type !== "file" || userId !== userFileId) return;
      fileIds.push(f.fileId!);
    });

    console.log("[ImageKit] listUserAvatarFileIds", JSON.stringify({ res, fileIds }));

    return fileIds;
  } catch (e) {
    console.warn("[ImageKit] listUserAvatarFileIds failed", e);
    return [];
  }
}

async function deleteFilesByIds(
  client: ReturnType<typeof getImageKitClient>,
  ids: string[],
): Promise<void> {
  await Promise.all(
    ids.map((id) =>
      client.files
        .delete(id)
        .catch((err: unknown) => console.warn(`[ImageKit] delete failed ${id}`, err)),
    ),
  );
}
