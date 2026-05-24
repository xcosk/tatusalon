import { prisma } from "@/lib/prisma";
import { WorkForm } from "@/components/admin/work-form";

export default async function NewWorkPage() {
  const [categories, artists] = await Promise.all([
    prisma.category.findMany({ where: { deletedAt: null } }),
    prisma.tattooArtist.findMany({ where: { deletedAt: null } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl">Новый эскиз</h1>
      <div className="mt-8">
        <WorkForm categories={categories} artists={artists} />
      </div>
    </div>
  );
}
