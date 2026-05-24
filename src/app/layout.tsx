/**
 * Корневой layout всего приложения: шрифты, мета-теги, Providers (вход + toast).
 * Публичные страницы дополнительно оборачивает (site)/layout.tsx (шапка/подвал).
 */
import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Analytics } from "@/components/shared/analytics";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${SITE_NAME} — авторская татуировка в Москве`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${bebas.variable} ${inter.variable} antialiased`}>
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
