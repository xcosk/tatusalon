import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkForm } from "@/components/admin/work-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params;
  const [work, categories, artists] = await Promise.all([
    prisma.tattooWork.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { deletedAt: null } }),
    prisma.tattooArtist.findMany({ where: { deletedAt: null } }),
  ]);
  if (!work) notFound();

  return (
    <div>
      <h1 className="font-display text-4xl">Редактировать</h1>
      <div className="mt-8">
        <WorkForm work={work} categories={categories} artists={artists} />
      </div>
    </div>
  );
}
