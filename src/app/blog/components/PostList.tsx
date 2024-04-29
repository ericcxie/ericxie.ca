import Post from "./Post";
import type { PostItem } from "@/types";

interface Props {
  posts: Record<string, PostItem[]>;
}

const PostList = ({ posts }: Props) => {
  const allPosts = Object.entries(posts).flatMap(([category, postItems]) =>
    postItems.map((postItem) => ({ ...postItem, category })),
  );

  allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mt-4 space-y-1">
      {allPosts.map((post, index) => (
        <Post category={post.category} posts={[post]} key={index} />
      ))}
    </div>
  );
};

export default PostList;
