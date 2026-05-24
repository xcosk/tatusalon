import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteWork } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function AdminWorksPage() {
  const works = await prisma.tattooWork.findMany({
    where: { deletedAt: null },
    include: { category: true, artist: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Эскизы</h1>
        <Button asChild>
          <Link href="/admin/works/new">Добавить</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DataTable headers={["Название", "Стиль", "Цена", "Статус", ""]}>
          {works.map((w) => (
            <tr key={w.id} className="border-b border-border">
              <td className="p-3 font-medium">{w.title}</td>
              <td className="p-3 text-muted">{w.style}</td>
              <td className="p-3">{w.priceFrom ? formatPrice(w.priceFrom) : "—"}</td>
              <td className="p-3">{w.isPublished ? "Опубликован" : "Черновик"}</td>
              <td className="p-3 flex gap-2">
                <Link href={`/admin/works/${w.id}`} className="text-xs underline">
                  Изменить
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteWork(w.id);
                  }}
                >
                  <button type="submit" className="text-xs text-red-600">
                    Удалить
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
