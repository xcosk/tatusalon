import { prisma } from "@/lib/prisma";
import { upsertGalleryItem } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Галерея</h1>
      <form
        action={async (fd) => {
          "use server";
          await upsertGalleryItem({
            imageUrl: fd.get("imageUrl") as string,
            title: (fd.get("title") as string) || undefined,
          });
        }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <input name="imageUrl" placeholder="URL изображения" className="border-b py-1 text-sm flex-1 min-w-[200px]" required />
        <input name="title" placeholder="Название" className="border-b py-1 text-sm" />
        <Button type="submit" size="sm">
          Добавить
        </Button>
      </form>
      <div className="mt-8">
        <DataTable headers={["Название", "URL", "Статус"]}>
          {items.map((i) => (
            <tr key={i.id} className="border-b border-border">
              <td className="p-3">{i.title ?? "—"}</td>
              <td className="p-3 max-w-xs truncate text-muted">{i.imageUrl}</td>
              <td className="p-3">{i.isPublished ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
