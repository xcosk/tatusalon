"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertBlogPost } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@prisma/client";

type BlogFormValues = {
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  isPublished: boolean;
};

function toFormValues(post?: BlogPost): BlogFormValues {
  if (!post) {
    return {
      title: "",
      excerpt: "",
      content: "",
      coverUrl: "",
      isPublished: false,
    };
  }

  return {
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverUrl: post.coverUrl ?? "",
    isPublished: post.isPublished,
  };
}

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<BlogFormValues>({
    defaultValues: toFormValues(post),
  });

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const result = await upsertBlogPost({
          id: post?.id,
          title: data.title,
          excerpt: data.excerpt || undefined,
          content: data.content,
          coverUrl: data.coverUrl || undefined,
          isPublished: data.isPublished,
        });
        if (result.success) {
          toast.success("Сохранено");
          router.push("/admin/blog");
        }
      })}
    >
      <div>
        <Label>Заголовок</Label>
        <Input {...register("title", { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>Обложка URL</Label>
        <Input {...register("coverUrl")} className="mt-1" />
      </div>
      <div>
        <Label>Краткое описание</Label>
        <Textarea {...register("excerpt")} className="mt-1" />
      </div>
      <div>
        <Label>Текст (Markdown)</Label>
        <Textarea {...register("content")} rows={12} className="mt-1 font-mono text-sm" />
      </div>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isPublished", { setValueAs: (v) => v === true || v === "on" })}
          defaultChecked={post?.isPublished ?? false}
        />
        Опубликован
      </label>
      <Button type="submit">Сохранить</Button>
    </form>
  );
}
