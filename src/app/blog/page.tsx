import PostList from "./components/PostList";
import { getCategorizedPosts } from "@/lib/blogs";

export default function Blog() {
  const posts = getCategorizedPosts();
  return (
    <main className="flex flex-col gap-4">
      <h1
        className="animate-in font-system text-3xl font-bold"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        Blog
      </h1>
      <div
        className="animate-in"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <PostList posts={posts} />
      </div>
    </main>
  );
}
