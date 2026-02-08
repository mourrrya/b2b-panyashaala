import { NextResponse } from "next/server";

export const handleSuccess = {
  get: <T>(data: T) => NextResponse.json({ data, success: true }),
  update: <T>(data: T) => NextResponse.json({ data, success: true }),
  create: <T>(data: T) => NextResponse.json({ data, success: true }, { status: 201 }),
  delete: () => NextResponse.json({ success: true }, { status: 204 }),
};
