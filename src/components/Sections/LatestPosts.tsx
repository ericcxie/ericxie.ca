import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

export default function LatestPosts() {
  return (
    <div>
      <Link
        className="mb-1 flex items-center gap-1 text-xl font-bold"
        href="/blog"
      >
        Latest Posts
        <ArrowUpRightIcon className="h-6 w-6 text-text-dark-headerDark transition-all hover:text-text-dark-body" />
      </Link>
      <p className="max-w-lg text-sm leading-relaxed text-text-dark-body md:text-base">
        I occasionally write about programming, productivity, and more. Stayed
        tuned for more!
      </p>
    </div>
  );
}
