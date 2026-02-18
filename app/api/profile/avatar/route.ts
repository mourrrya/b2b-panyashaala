import { protect, ProtectedRequest } from "@/lib/auth/protect";
import { ErrorInvalidRequest, handleError } from "@/lib/backend/errorHandler";
import { ERROR_MESSAGES } from "@/lib/constants";
import { Customer } from "@/prisma/generated/prisma/client";
import type { ErrorServerRes, GetServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { uploadAvatar } from "../../services/imagekitService";
import { updateProfile } from "../../services/profileServices";

/**
 * POST /api/profile/avatar
 * ========================
 * Accepts multipart/form-data with a single `file` field.
 * Uploads the image to ImageKit, then persists the CDN URL
 * on the customer's `avatarUrl` field.
 *
 * Returns the updated profile.
 */
async function uploadAvatarHandler(
  request: ProtectedRequest,
): Promise<NextResponse<GetServerRes<Customer> | ErrorServerRes>> {
  try {
    const { user } = request.auth;

    // --- Parse multipart form data -----------------------------------------
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      throw new ErrorInvalidRequest(ERROR_MESSAGES.FILE.UPLOAD_FAILED);
    }

    // --- Convert Web File to Node Buffer -----------------------------------
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --- Upload to ImageKit ------------------------------------------------
    const { url } = await uploadAvatar(user.id, buffer, file.type, file.name);

    // --- Persist CDN URL on profile ----------------------------------------
    const profile = await updateProfile(user.id, { avatarUrl: url });

    return NextResponse.json({ data: profile, success: true });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = protect(uploadAvatarHandler);
