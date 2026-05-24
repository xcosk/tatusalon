import Image from "next/image";

export function StudioSpaceSection() {
  return (
    <section className="relative min-h-[60vh]">
      <Image
        src="/images/studio-interior-3edddf.png"
        alt="Интерьер студии"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="container-site relative flex min-h-[60vh] flex-col justify-end pb-16 text-white">
        <p className="text-xs uppercase tracking-[0.3em]">Никольская 12</p>
        <h2 className="mt-2 font-display text-6xl tracking-[0.02em] md:text-7xl">
          ЖИВОЕ ПРОСТРАНСТВО
        </h2>
      </div>
    </section>
  );
}
