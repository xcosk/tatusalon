/**
 * Карта сайта для поисковиков (SEO).
 * staticRoutes — фиксированные страницы; остальное подтягивается из БД (эскизы, блог, мастера).
 */
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const staticRoutes: MetadataRoute.Sitemap = [
  "",
  "/eskizy",
  "/zapis",
  "/o-nas",
  "/galereya",
  "/kontakty",
  "/blog",
  "/vhod",
  "/registraciya",
].map((path) => ({
  url: `${baseUrl}${path}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: path === "" ? 1 : 0.8,
}));

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [works, posts, artists] = await Promise.all([
      prisma.tattooWork.findMany({
        where: { isPublished: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.tattooArtist.findMany({
        where: { isActive: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...works.map((w) => ({
        url: `${baseUrl}/eskizy/${w.slug}`,
        lastModified: w.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...posts.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...artists.map((a) => ({
        url: `${baseUrl}/master/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
