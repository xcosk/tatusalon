import { prisma } from "@/lib/prisma";
import type { PaginatedResult } from "@/types";

export async function getPublishedWorks({
  page = 1,
  pageSize = 12,
  categorySlug,
  search,
}: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
}) {
  const where = {
    isPublished: true,
    deletedAt: null,
    ...(categorySlug
      ? { category: { slug: categorySlug, deletedAt: null } }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { style: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.tattooWork.findMany({
      where,
      include: { category: true, artist: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tattooWork.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  } satisfies PaginatedResult<(typeof items)[number]>;
}

export async function getFeaturedWorks(limit = 6) {
  return prisma.tattooWork.findMany({
    where: { isPublished: true, isFeatured: true, deletedAt: null },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getWorkBySlug(slug: string) {
  return prisma.tattooWork.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: { category: true, artist: true },
  });
}
