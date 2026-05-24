import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export default async function AdminMastersPage() {
  const artists = await prisma.tattooArtist.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-display text-4xl">Мастера</h1>
        <Button asChild>
          <Link href="/admin/masters/new">Добавить</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DataTable headers={["Имя", "Стили", "Активен", ""]}>
          {artists.map((a) => (
            <tr key={a.id} className="border-b border-border">
              <td className="p-3 font-medium">{a.name}</td>
              <td className="p-3 text-muted">{a.styles.join(", ")}</td>
              <td className="p-3">{a.isActive ? "Да" : "Нет"}</td>
              <td className="p-3">
                <Link href={`/admin/masters/${a.id}`} className="text-xs underline">
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
