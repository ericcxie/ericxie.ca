import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { getPostData } from "@/lib/blogs";

const Post = async ({ params }: { params: { slug: string } }) => {
  const postData = await getPostData(params.slug);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between">
        <p>{postData.date.toString()}</p>
      </div>
      <article
        className="post"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </section>
  );
};

export default Post;
