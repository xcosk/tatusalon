import { STYLE_TAGS } from "@/lib/constants";

export function StylesMarquee() {
  const items = [...STYLE_TAGS, ...STYLE_TAGS];

  return (
    <section className="overflow-hidden border-y border-border bg-black py-6 text-white" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {items.map((style, i) => (
          <span
            key={`${style}-${i}`}
            className="font-display text-3xl tracking-[0.1em]"
          >
            {style}
            <span className="mx-8 text-white/30">✕</span>
          </span>
        ))}
      </div>
    </section>
  );
}
