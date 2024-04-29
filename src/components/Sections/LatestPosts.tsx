import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { getCategorizedPosts } from "@/lib/blogs";
import Post from "@/app/blog/components/Post";
import PostList from "@/app/blog/components/PostList";

export default function LatestPosts() {
  const posts = getCategorizedPosts();

  return (
    <div>
      <Link
        className="mb-1 flex items-center gap-1 text-xl font-bold"
        href="/blog"
      >
        Latest Posts
        <ArrowUpRightIcon className="h-6 w-6 text-text-dark-headerDark transition-all hover:text-text-dark-body" />
      </Link>
      <p className="mb-4 max-w-lg text-sm leading-relaxed text-text-light-body dark:text-text-dark-body md:text-base">
        I occasionally write about programming, productivity, and more.
      </p>
      <PostList posts={posts} />
    </div>
  );
}
