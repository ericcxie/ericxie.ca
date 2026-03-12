import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-upload-password");
  return password === process.env.UPLOAD_PASSWORD;
}

// Upload a single file to Vercel Blob (no metadata — that's handled by /api/photos/metadata)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(`photos/${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url, filename: file.name });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
