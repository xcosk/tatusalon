import { prisma } from "@/lib/prisma";
import { upsertCategory } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Категории</h1>
      <form
        action={async (fd) => {
          "use server";
          await upsertCategory({ name: fd.get("name") as string });
        }}
        className="mt-4 flex gap-2"
      >
        <input name="name" placeholder="Новая категория" className="border-b py-1 text-sm" required />
        <Button type="submit" size="sm">
          Добавить
        </Button>
      </form>
      <div className="mt-8">
        <DataTable headers={["Название", "Slug"]}>
          {categories.map((c) => (
            <tr key={c.id} className="border-b border-border">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-muted">{c.slug}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
