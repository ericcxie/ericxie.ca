import { put, list, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { PhotoMetadata } from "../route";

const METADATA_KEY = "photos-metadata.json";

async function getMetadata(): Promise<PhotoMetadata[]> {
  try {
    const { blobs } = await list({ prefix: METADATA_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

async function saveMetadata(metadata: PhotoMetadata[]) {
  const { blobs } = await list({ prefix: METADATA_KEY });
  for (const blob of blobs) {
    await del(blob.url);
  }
  await put(METADATA_KEY, JSON.stringify(metadata), {
    access: "public",
    contentType: "application/json",
  });
}

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-upload-password");
  return password === process.env.UPLOAD_PASSWORD;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const location = (formData.get("location") as string) || "";
    const date =
      (formData.get("date") as string) || new Date().toISOString();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`photos/${file.name}`, file, {
      access: "public",
    });

    // Update metadata
    const metadata = await getMetadata();
    const newPhoto: PhotoMetadata = {
      url: blob.url,
      filename: file.name,
      location,
      date,
    };
    metadata.unshift(newPhoto); // Add to front (newest first)
    await saveMetadata(metadata);

    return NextResponse.json(newPhoto);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 },
    );
  }
}
