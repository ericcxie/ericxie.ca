import { getPostData } from "@/lib/blogs";

const Post = async ({ params }: { params: { slug: string } }) => {
  const postData = await getPostData(params.slug);

  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">{postData.title}</h1>
      <p className="text-text-light-body dark:text-text-dark-body">
        {postData.date}
      </p>
      <article
        className="post"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </section>
  );
};

export default Post;
