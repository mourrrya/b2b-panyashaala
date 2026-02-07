import { protect, ProtectedRequest } from "@/lib/auth/protect";
import { handleError } from "@/lib/backend/errorHandler";
import { validateRequestBody } from "@/lib/backend/validation";
import { UpdateProfileReqSchema } from "@/lib/schema/schemas";
import { Customer } from "@/prisma/generated/prisma/client";
import type { ErrorServerRes, GetServerRes } from "@/types/api.payload.types";
import { NextResponse } from "next/server";
import { getOrCreateProfile, updateProfile } from "../services/profileServices";

async function getProfileHandler(
  request: ProtectedRequest,
): Promise<NextResponse<GetServerRes<Customer> | ErrorServerRes>> {
  try {
    const { user } = request.auth;
    const profile = await getOrCreateProfile(user.id, user);
    return NextResponse.json({ data: profile, success: true });
  } catch (error) {
    return handleError(error);
  }
}

async function updateProfileHandler(
  request: ProtectedRequest,
): Promise<NextResponse<GetServerRes<Customer> | ErrorServerRes>> {
  try {
    const validation = await validateRequestBody(request, UpdateProfileReqSchema);
    const body = validation.data;
    const { user } = request.auth;
    const profile = await updateProfile(user.id, body);
    return NextResponse.json({ data: profile, success: true });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = protect(getProfileHandler);
export const PUT = protect(updateProfileHandler);
