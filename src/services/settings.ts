import { prisma } from "@/lib/prisma";

const defaults = {
  address: "ул. Никольская 12, Москва",
  phone: "+7 (495) 000-00-00",
  email: "hello@inkstudio.ru",
  workingHours: "Ежедневно 12:00 – 22:00",
  tagline: "Авторская татуировка. С 2014.",
  mapEmbedUrl: null as string | null,
  socialTelegram: null as string | null,
  socialInstagram: null as string | null,
};

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return { ...defaults, ...settings };
  } catch {
    return defaults;
  }
}
