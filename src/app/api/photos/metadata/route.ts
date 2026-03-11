import { put, list, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
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

// PATCH: Update metadata for a single photo (by URL)
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, location, date } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const metadata = await getMetadata();
    const index = metadata.findIndex((p) => p.url === url);
    if (index === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (location !== undefined) metadata[index].location = location;
    if (date !== undefined) metadata[index].date = date;
    await saveMetadata(metadata);
    revalidatePath("/photos");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Metadata update error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Save metadata for newly uploaded photos (called once after all uploads finish)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newPhotos: PhotoMetadata[] = await request.json();

    if (!Array.isArray(newPhotos) || newPhotos.length === 0) {
      return NextResponse.json(
        { error: "No photo metadata provided" },
        { status: 400 },
      );
    }

    const metadata = await getMetadata();
    metadata.unshift(...newPhotos);
    await saveMetadata(metadata);
    revalidatePath("/photos");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Metadata save error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
