type PageHeroProps = {
  label: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
};

export function PageHero({ label, title, description, aside }: PageHeroProps) {
  return (
    <section className="border-b border-border">
      <div className="container-site py-16 lg:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.95] tracking-[0.02em] whitespace-pre-line">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-xl text-sm text-muted">{description}</p>
            )}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
