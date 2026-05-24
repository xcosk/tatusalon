import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="grid lg:grid-cols-[1.4fr_1fr] lg:min-h-[calc(100vh-65px)]">
      <div className="flex flex-col justify-between border-r border-border px-6 py-12 lg:px-16 lg:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            № 014 — Москва, с 2014
          </p>
          <h1 className="mt-16 font-display text-[clamp(3.5rem,10vw,11rem)] leading-[0.85] tracking-[-0.025em]">
            ЧЕРНИЛА
            <br />
            <span className="text-muted">КАК</span> ЯЗЫК.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
            Авторская студия татуировки. Работаем медленно, чисто и только с тем,
            во что верим. Каждый эскиз — разговор, а не каталог.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/zapis">Записаться</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/eskizy">Смотреть эскизы →</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 flex justify-between text-xs text-muted lg:mt-0">
          <span>11 лет / 6 мастеров</span>
          <span>54.6° N — 37.6° E</span>
        </div>
      </div>
      <div className="relative min-h-[50vh] lg:min-h-0">
        <Image
          src="/images/hero-master-3d8ad4.png"
          alt="Мастер за работой"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <span className="absolute bottom-8 right-8 font-display text-5xl text-white">
          01
        </span>
      </div>
    </section>
  );
}
