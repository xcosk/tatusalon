import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/shared/page-hero";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata = {
  title: "Блог",
  description: "Статьи о татуировке, уходе и студии",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero label="№ 007 / Блог" title="БЛОГ" />
      <section className="container-site pb-24">
        {posts.length === 0 ? (
          <p className="text-muted">Скоро появятся статьи</p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group">
                  {post.coverUrl && (
                    <div className="relative mb-4 aspect-[16/10] bg-surface">
                      <Image
                        src={post.coverUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs uppercase tracking-[0.1em] text-muted">
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-display text-3xl group-hover:opacity-70">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
