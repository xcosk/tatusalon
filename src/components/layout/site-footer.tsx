import Link from "next/link";
import { getSiteSettings } from "@/services/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const { address, phone, email, workingHours: hours, tagline } = settings;

  return (
    <footer className="border-t border-border">
      <div className="container-site grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-xl tracking-[0.1em]">INK / STUDIO</p>
          <p className="mt-2 text-xs text-muted">{tagline}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.1em]">Адрес</h4>
          <p className="mt-3 whitespace-pre-line text-sm text-muted">{address.replace(", ", "\n")}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.1em]">Контакт</h4>
          <p className="mt-3 text-sm text-muted">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-black">
              {phone}
            </a>
            <br />
            <a href={`mailto:${email}`} className="hover:text-black">
              {email}
            </a>
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.1em]">Часы</h4>
          <p className="mt-3 whitespace-pre-line text-sm text-muted">{hours.replace(" ", "\n")}</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        <div className="container-site flex flex-wrap items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} INK / STUDIO</span>
          <Link href="/kontakty" className="hover:text-black">
            Контакты
          </Link>
          <Link href="/blog" className="hover:text-black">
            Блог
          </Link>
          <Link href="/galereya" className="hover:text-black">
            Галерея
          </Link>
        </div>
      </div>
    </footer>
  );
}
