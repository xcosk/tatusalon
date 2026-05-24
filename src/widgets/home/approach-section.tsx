import { SectionLabel } from "@/components/shared/section-label";

const steps = [
  {
    num: "01",
    title: "Консультация",
    text: "Сначала разговор: идея, тело, ритм жизни. Эскиз рождается из этого.",
  },
  {
    num: "02",
    title: "Эскиз",
    text: "Делаем индивидуально. Не тиражируем. Согласовываем каждую линию.",
  },
  {
    num: "03",
    title: "Сеанс",
    text: "Стерильно, спокойно, без спешки. Сопровождение и уход после.",
  },
];

export function ApproachSection() {
  return (
    <section className="container-site py-24">
      <SectionLabel>— Подход</SectionLabel>
      <h2 className="mt-4 font-display text-5xl tracking-[0.02em]">Без шаблонов.</h2>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.num} className="border-t border-black pt-6">
            <span className="font-display text-2xl">{step.num}</span>
            <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
            <p className="mt-3 text-sm text-muted">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
