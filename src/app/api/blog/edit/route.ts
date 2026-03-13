import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const GITHUB_REPO = "ericcxie/ericxie.ca";
const BLOG_DIR = "src/content/blog";

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-upload-password");
  return password === process.env.UPLOAD_PASSWORD;
}

// GET: Return list of posts or a single post's raw markdown
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const postsDirectory = path.join(process.cwd(), BLOG_DIR);

  try {
    if (slug) {
      const filePath = path.join(postsDirectory, `${slug}.md`);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data, content: markdown } = matter(content);
      return NextResponse.json({
        slug,
        title: data.title,
        category: data.category,
        date: data.date,
        content: markdown.trim(),
      });
    }

    // Return all posts
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter((f) => f.endsWith(".md"))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const filePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContents);
        return {
          slug: id,
          title: data.title,
          category: data.category,
          date: data.date,
        };
      });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Failed to read blog posts" },
      { status: 500 },
    );
  }
}

// POST: Create or update a blog post via GitHub API
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
    const { slug, title, category, date, content } = await request.json();

    if (!slug || !title || !category || !date || content === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const frontmatter = `---\ntitle: "${title}"\n\ncategory: "${category}"\n\ndate: "${date}"\n---\n\n${content}\n`;

    const filePath = `${BLOG_DIR}/${slug}.md`;

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

    // 3. Create blob for the markdown file
    const blobRes = await fetch(`${apiBase}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content: frontmatter, encoding: "utf-8" }),
    });
    const blob = await blobRes.json();

    // 4. Create the new tree
    const treeRes = await fetch(`${apiBase}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          {
            path: filePath,
            mode: "100644",
            type: "blob",
            sha: blob.sha,
          },
        ],
      }),
    });
    const treeData = await treeRes.json();

    // Check if this is an existing file to determine commit message
    const existingPath = path.join(process.cwd(), filePath);
    const isNew = !fs.existsSync(existingPath);
    const commitMessage = isNew
      ? `add blog post: ${title}`
      : `update blog post: ${title}`;

    // 5. Create the commit
    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: commitMessage,
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
    console.error("Blog edit commit error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete a blog post via GitHub API
export async function DELETE(request: NextRequest) {
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
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug" },
        { status: 400 },
      );
    }

    const filePath = `${BLOG_DIR}/${slug}.md`;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    const apiBase = `https://api.github.com/repos/${GITHUB_REPO}`;

    // Get file SHA from GitHub
    const fileRes = await fetch(
      `${apiBase}/contents/${filePath}?ref=main`,
      { headers },
    );
    const fileData = await fileRes.json();

    if (!fileRes.ok) {
      return NextResponse.json(
        { error: "File not found on GitHub" },
        { status: 404 },
      );
    }

    // Delete file via GitHub Contents API
    await fetch(`${apiBase}/contents/${filePath}`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({
        message: `delete blog post: ${slug}`,
        sha: fileData.sha,
        branch: "main",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
