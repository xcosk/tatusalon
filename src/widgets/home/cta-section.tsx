import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="container-site py-32 text-center">
      <h2 className="font-display text-[clamp(4rem,15vw,9rem)] leading-none tracking-[0.02em]">
        ГОТОВ?
      </h2>
      <p className="mx-auto mt-8 max-w-md text-sm text-muted">
        Запишись на консультацию. Это бесплатно и ни к чему не обязывает.
      </p>
      <Button asChild className="mt-10">
        <Link href="/zapis">Записаться на сеанс</Link>
      </Button>
    </section>
  );
}
