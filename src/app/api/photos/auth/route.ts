import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const password = request.headers.get("x-upload-password");
  if (password === process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
