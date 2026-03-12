import { put, list, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { PhotoMetadata } from "../route";

const GITHUB_REPO = "ericcxie/ericxie.ca";

async function triggerSync() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("triggerSync: GITHUB_TOKEN is not set");
    return;
  }
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/sync-photos.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({ ref: "main" }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`triggerSync failed: ${res.status} ${res.statusText}`, body);
  }
}

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

    // Trigger GitHub Action to sync photos to repo
    try {
      await triggerSync();
    } catch (err) {
      console.error("Failed to trigger sync:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Metadata save error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
