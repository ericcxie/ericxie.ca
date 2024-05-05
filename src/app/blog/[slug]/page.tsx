import { getPostData } from "@/lib/blogs";

const Post = async ({ params }: { params: { slug: string } }) => {
  const postData = await getPostData(params.slug);

  return (
    <section className="flex flex-col gap-5">
      <article
        className="post"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </section>
  );
};

export default Post;
