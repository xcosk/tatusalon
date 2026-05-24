"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, isAdminRole } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="container-site flex h-[65px] items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-[0.1em]">
          INK<span className="text-muted">/</span>STUDIO
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-[0.2em] transition-colors hover:text-black",
                pathname === link.href ? "text-black" : "text-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          {session ? (
            <Link
              href={isAdminRole(session.user.role) ? "/admin" : "/kabinet"}
              className="text-xs uppercase tracking-[0.1em] text-muted hover:text-black"
            >
              {isAdminRole(session.user.role) ? "Админ" : "Кабинет"}
            </Link>
          ) : (
            <Link
              href="/vhod"
              className="text-xs uppercase tracking-[0.1em] text-muted hover:text-black"
            >
              Вход
            </Link>
          )}
          {!session && (
            <Button asChild size="sm" className="h-8">
              <Link href="/registraciya">Регистрация</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <nav className="container-site flex flex-col gap-4 py-6" aria-label="Мобильная навигация">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.2em]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                <Link href="/vhod" onClick={() => setOpen(false)}>
                  Вход
                </Link>
                <Button asChild>
                  <Link href="/registraciya" onClick={() => setOpen(false)}>
                    Регистрация
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
