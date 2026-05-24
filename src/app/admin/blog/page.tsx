import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-display text-4xl">Блог</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Новая статья</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DataTable headers={["Заголовок", "Статус", ""]}>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.isPublished ? "Опубликован" : "Черновик"}</td>
              <td className="p-3">
                <Link href={`/admin/blog/${p.id}`} className="text-xs underline">
                  Изменить
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
