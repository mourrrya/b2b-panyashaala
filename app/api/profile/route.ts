import { ErrorResponse, handleError } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { protect } from "@/lib/backend/protect";
import { validateRequestBody } from "@/lib/backend/validation";
import { UpdateProfileReqSchema } from "@/lib/schemas";
import type { SuccessRes } from "@/lib/types/api.payload.types";
import { Customer } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateProfile, updateProfile } from "../services/profileServices";

async function getProfileHandler(
  request: NextRequest,
): Promise<NextResponse<SuccessRes<Customer> | ErrorResponse>> {
  try {
    const { user } = request.auth!;
    const profile = await getOrCreateProfile(user.id, user);
    return NextResponse.json({ data: profile, success: true });
  } catch (error) {
    logger.error({ error }, "Error fetching profile");
    return handleError(error);
  }
}

async function updateProfileHandler(
  request: NextRequest,
): Promise<NextResponse<SuccessRes<Customer> | ErrorResponse>> {
  try {
    const validation = await validateRequestBody(
      request,
      UpdateProfileReqSchema,
    );
    const body = validation.data;
    const { user } = request.auth!;
    const profile = await updateProfile(user.id, body);
    return NextResponse.json({ data: profile, success: true });
  } catch (error) {
    logger.error({ error }, "Error updating profile");
    return handleError(error);
  }
}

export const GET = protect(getProfileHandler);
export const PUT = protect(updateProfileHandler);
