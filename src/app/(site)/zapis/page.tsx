import { Suspense } from "react";
import { getActiveArtists } from "@/services/artists";
import { PageHero } from "@/components/shared/page-hero";
import { BookingForm } from "@/features/booking/booking-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Запись",
  description: "Запишитесь на консультацию или сеанс в INK / STUDIO",
};

const steps = [
  "Оставляешь заявку",
  "Мастер пишет в течение 24 часов",
  "Согласовываем эскиз и аванс 30%",
  "В день сеанса — кофе и работа",
];

export default async function BookingPage() {
  const artists = await getActiveArtists();

  return (
    <>
      <PageHero
        label="№ 004 / Запись"
        title="ЗАПИСЬ"
        description="Выбери мастера, дату и оставь идею. Мы перезвоним и подтвердим за 24 часа."
      />
      <section className="container-site grid gap-16 pb-24 lg:grid-cols-[1fr_400px]">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <BookingForm artists={artists} />
        </Suspense>
        <aside className="border border-border p-8 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-3xl">КАК ЭТО ИДЁТ</h2>
          <ol className="mt-8 space-y-0">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 border-t border-border py-4 first:border-t"
              >
                <span className="font-display text-sm">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-muted">
            Минимальный сеанс — 5 000 ₽. Цена обсуждается после эскиза.
          </p>
        </aside>
      </section>
    </>
  );
}
