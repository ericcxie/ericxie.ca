import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const GITHUB_REPO = "ericcxie/ericxie.ca";
const ABOUT_JSON_PATH = "src/content/about.json";

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-upload-password");
  return password === process.env.UPLOAD_PASSWORD;
}

// GET: Return current about.json from local filesystem
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), ABOUT_JSON_PATH);
    const content = await readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(
      { error: "Failed to read about.json" },
      { status: 500 },
    );
  }
}

// POST: Commit edits to about.json via GitHub API
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 },
    );
  }

  try {
    const data = await request.json();

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    const apiBase = `https://api.github.com/repos/${GITHUB_REPO}`;

    // 1. Get the current commit SHA for main
    const refRes = await fetch(`${apiBase}/git/ref/heads/main`, { headers });
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // 2. Get the tree SHA from that commit
    const commitRes = await fetch(
      `${apiBase}/git/commits/${latestCommitSha}`,
      { headers },
    );
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // 3. Create blob for updated about.json
    const newJson = JSON.stringify(data, null, 2) + "\n";
    const jsonBlobRes = await fetch(`${apiBase}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content: newJson, encoding: "utf-8" }),
    });
    const jsonBlob = await jsonBlobRes.json();

    // 4. Create the new tree
    const treeRes = await fetch(`${apiBase}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          {
            path: ABOUT_JSON_PATH,
            mode: "100644",
            type: "blob",
            sha: jsonBlob.sha,
          },
        ],
      }),
    });
    const treeData = await treeRes.json();

    // 5. Create the commit
    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: "update about page content",
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    });
    const newCommit = await newCommitRes.json();

    // 6. Update the ref
    await fetch(`${apiBase}/git/refs/heads/main`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sha: newCommit.sha }),
    });

    return NextResponse.json({ success: true, sha: newCommit.sha });
  } catch (error) {
    console.error("Edit commit error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save changes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
