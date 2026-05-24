import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getPublishedWorks } from "@/services/works";
import { getFavoriteWorkIds } from "@/services/favorites";
import { PageHero } from "@/components/shared/page-hero";
import { CatalogFilters } from "@/features/catalog/catalog-filters";
import { WorkCard } from "@/features/catalog/work-card";
import { LoadMoreWorks } from "@/features/catalog/load-more";
import { FavoritesProvider } from "@/features/favorites/favorites-provider";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 300;

type Props = {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const categorySlug = params.category;
  const search = params.q;

  const session = await getServerSession(authOptions);

  const [categories, worksResult, favoriteIds] = await Promise.all([
    prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
    }),
    getPublishedWorks({ page, pageSize: 12, categorySlug, search }),
    session?.user?.id ? getFavoriteWorkIds(session.user.id) : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHero
        label="№ 002 / Каталог"
        title="ЭСКИЗЫ"
        aside={
          <p className="text-right text-xs text-muted">
            {worksResult.total} работ
            <br />
            авторских
          </p>
        }
      />
      <FavoritesProvider initialIds={favoriteIds}>
        <section className="container-site pb-24">
          <Suspense fallback={<Skeleton className="h-12 w-full" />}>
            <CatalogFilters categories={categories} />
          </Suspense>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {worksResult.items.map((work, i) => (
              <WorkCard key={work.id} work={work} index={(page - 1) * 12 + i} />
            ))}
          </div>
          {worksResult.items.length === 0 && (
            <p className="py-24 text-center text-muted">Эскизы не найдены</p>
          )}
          <LoadMoreWorks
            initialPage={page}
            totalPages={worksResult.totalPages}
            categorySlug={categorySlug}
            search={search}
          />
        </section>
      </FavoritesProvider>
    </>
  );
}
