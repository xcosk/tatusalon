import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div>
      <h1 className="font-display text-4xl">Редактировать статью</h1>
      <div className="mt-8">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
