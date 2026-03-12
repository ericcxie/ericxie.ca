import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

// Client upload handler — generates a token for the browser to upload directly to blob
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Verify password from client payload
        const { password } = JSON.parse(clientPayload || "{}");
        if (password !== process.env.UPLOAD_PASSWORD) {
          throw new Error("Unauthorized");
        }

        return {
          allowedContentTypes: ["image/webp", "image/jpeg", "image/png", "image/heic"],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async () => {
        // No-op: metadata is handled separately
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
