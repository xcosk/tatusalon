import Image from "next/image";
import Link from "next/link";
import { getActiveArtists } from "@/services/artists";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { ReviewSection } from "@/features/reviews/review-section";

export const metadata = {
  title: "О студии",
  description: "История и команда авторской тату-студии INK / STUDIO в Москве",
};

const stats = [
  { value: "11", label: "лет работы" },
  { value: "6", label: "мастеров" },
  { value: "2.3K", label: "клиентов" },
  { value: "0", label: "копий" },
];

export default async function AboutPage() {
  const artists = await getActiveArtists();

  return (
    <>
      <PageHero label="№ 003 / О студии" title={"ОДИН-\nНАДЦАТЬ ЛЕТ."} />
      <section className="container-site grid gap-16 py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/5] bg-surface">
          <Image
            src="/images/about-studio-4ff87d.png"
            alt="Студия"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-8">
          <p className="font-display text-5xl leading-tight">
            Мы открылись в 2014 — три мастера, одна комната и принцип: татуировка
            должна быть личной.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Сегодня в студии работают шесть мастеров, каждый со своей графикой. Мы
            не штампуем флеши и не делаем «как у блогера». Каждый эскиз — это
            диалог: про идею, про тело, про жизнь.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Стерильность, индивидуальные расходники, медицинский подход.
            Сопровождаем после сеанса и закладываем коррекцию в стоимость. Берёмся
            не за всё — иногда честнее отказать.
          </p>
        </div>
      </section>
      <section className="grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-border px-8 py-16 sm:border-r last:border-r-0"
          >
            <p className="font-display text-8xl tracking-[0.02em]">{stat.value}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.1em] text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </section>
      <section className="container-site py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">— Команда</p>
        <h2 className="mt-4 font-display text-5xl">Мастера</h2>
        <div className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/master/${artist.slug}`}
              className="border-t border-black py-4"
            >
              <h3 className="font-bold">{artist.name}</h3>
              <p className="text-xs uppercase tracking-[0.1em] text-muted">
                {artist.styles.join(", ")}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild variant="outline" className="border-2">
            <Link href="/zapis">Записаться к мастеру →</Link>
          </Button>
        </div>
      </section>
      <ReviewSection />
    </>
  );
}
