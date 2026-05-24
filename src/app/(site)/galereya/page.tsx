import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shared/page-hero";
import { GalleryGrid } from "@/features/gallery/gallery-grid";

export const metadata = {
  title: "Галерея",
  description: "Галерея работ INK / STUDIO",
};

export const revalidate = 300;

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { isPublished: true, deletedAt: null },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <>
      <PageHero label="№ 005 / Галерея" title="ГАЛЕРЕЯ" />
      <section className="container-site pb-24">
        <GalleryGrid items={items} categories={categories} />
      </section>
    </>
  );
}
