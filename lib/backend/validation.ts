import { NextRequest } from "next/server";
import queryString from "query-string";
import { z } from "zod";
import { ErrorInvalidRequest } from "./errorHandler";

type ValidationResult<T> = Promise<{
  success: true;
  data: T;
}>;

export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  const body = await request.json();
  const { success, error, data } = schema.safeParse(body);
  if (!success) throw new ErrorInvalidRequest("Invalid request body", error.issues);
  return { success: true, data: data };
}

export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>,
): { success: true; data: T } {
  const params = queryString.parse(searchParams.toString(), { parseNumbers: true });
  const { data, error, success } = schema.safeParse(params);
  if (!success) throw new ErrorInvalidRequest("Invalid query parameters", error.issues);
  return { success: true, data: data };
}
