import PostList from "./components/PostList";
import { getCategorizedPosts } from "@/lib/blogs";

export default function Blog() {
  const posts = getCategorizedPosts();
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-system text-3xl font-bold">Blog</h1>
      {/* <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.  Sit amet luctus
        venenatis lectus magna fringilla. Iaculis at erat pellentesque
        adipiscing commodo elit at imperdiet dui.
      </p> */}
      <PostList posts={posts} />
    </main>
  );
}
