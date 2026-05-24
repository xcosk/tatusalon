import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/features/contact/contact-form";
import { getSiteSettings } from "@/services/settings";

export const metadata = {
  title: "Контакты",
  description: "Контакты и адрес студии INK / STUDIO",
};

export default async function ContactsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        label="№ 006 / Контакты"
        title="КОНТАКТЫ"
        description="Мы на Никольской. Пишите, звоните, приходите."
      />
      <section className="container-site grid gap-16 pb-24 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="text-xs uppercase tracking-[0.1em]">Адрес</h2>
            <p className="mt-2">{settings?.address}</p>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.1em]">Телефон</h2>
            <a href={`tel:${settings?.phone}`} className="mt-2 block hover:underline">
              {settings?.phone}
            </a>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.1em]">Email</h2>
            <a href={`mailto:${settings?.email}`} className="mt-2 block hover:underline">
              {settings?.email}
            </a>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.1em]">Часы</h2>
            <p className="mt-2">{settings?.workingHours}</p>
          </div>
          {(settings?.socialTelegram || settings?.socialInstagram) && (
            <div className="flex gap-4 text-sm uppercase tracking-[0.1em]">
              {settings.socialTelegram && (
                <a href={settings.socialTelegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              )}
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>
        <ContactForm />
      </section>
      {settings?.mapEmbedUrl && (
        <div className="container-site pb-24">
          <iframe
            title="Карта студии"
            src={settings.mapEmbedUrl}
            className="h-[400px] w-full border border-border"
            loading="lazy"
          />
        </div>
      )}
    </>
  );
}
