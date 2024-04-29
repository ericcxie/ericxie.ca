import Link from "next/link";
import type { PostItem } from "@/types";
import moment from "moment";
interface Props {
  category: string;
  posts: PostItem[];
}

const Post = ({ category, posts }: Props) => {
  return (
    <div>
      {posts.map((post, id) => (
        <div key={id} className="flex justify-start gap-4 md:gap-10">
          <div className="w-32 text-text-light-body dark:text-text-dark-headerDark">
            {moment(post.date, "MM-DD-YYYY").format("MMM DD, YYYY")}
          </div>
          <Link href={`/blog/${post.id}`} className="block hover:underline">
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Post;
