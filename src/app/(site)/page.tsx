import { JsonLd } from "@/components/shared/json-ld";
import { HeroSection } from "@/widgets/home/hero-section";
import { StylesMarquee } from "@/widgets/home/styles-marquee";
import { ApproachSection } from "@/widgets/home/approach-section";
import { StudioSpaceSection } from "@/widgets/home/studio-space";
import { FeaturedWorksSection } from "@/widgets/home/featured-works";
import { MastersPreviewSection } from "@/widgets/home/masters-preview";
import { ReviewsSection } from "@/widgets/home/reviews-section";
import { CtaSection } from "@/widgets/home/cta-section";

export const revalidate = 3600;

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: "INK / STUDIO",
  description:
    "Авторская студия татуировки в Москве. Индивидуальные эскизы, стерильность, опытные мастера.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Никольская 12",
    addressLocality: "Москва",
    addressCountry: "RU",
  },
  telephone: "+7-495-000-00-00",
  openingHours: "Mo-Su 12:00-22:00",
  url: process.env.NEXT_PUBLIC_APP_URL,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusiness} />
      <HeroSection />
      <StylesMarquee />
      <ApproachSection />
      <FeaturedWorksSection />
      <MastersPreviewSection />
      <ReviewsSection />
      <StudioSpaceSection />
      <CtaSection />
    </>
  );
}
