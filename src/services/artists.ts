/**
 * Запросы мастеров из БД (без форм).
 * getActiveArtists — список для записи и фильтров.
 * getArtistBySlug — страница /master/[slug] с эскизами и опубликованными отзывами.
 */
import { prisma } from "@/lib/prisma";

export async function getActiveArtists() {
  return prisma.tattooArtist.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getArtistBySlug(slug: string) {
  return prisma.tattooArtist.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: {
      works: {
        where: { isPublished: true, deletedAt: null },
        take: 12,
        orderBy: { sortOrder: "asc" },
      },
      reviews: {
        where: { isPublished: true, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}
