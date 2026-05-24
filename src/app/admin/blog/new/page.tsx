import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Новая статья</h1>
      <div className="mt-8">
        <BlogForm />
      </div>
    </div>
  );
}
