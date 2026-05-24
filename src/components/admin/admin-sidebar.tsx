/**
 * Боковое меню админ-панели — ссылки на разделы /admin/*
 * «Выйти» — signOut из NextAuth
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Palette,
  UserCircle,
  Calendar,
  MessageSquare,
  FileText,
  Image,
  Tags,
  Settings,
  Mail,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/works", label: "Эскизы", icon: Palette },
  { href: "/admin/masters", label: "Мастера", icon: UserCircle },
  { href: "/admin/categories", label: "Категории", icon: Tags },
  { href: "/admin/gallery", label: "Галерея", icon: Image },
  { href: "/admin/bookings", label: "Заявки", icon: Calendar },
  { href: "/admin/contacts", label: "Сообщения", icon: Mail },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquare },
  { href: "/admin/blog", label: "Блог", icon: FileText },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-border bg-white">
      <div className="border-b border-border p-4">
        <Link href="/" className="font-display text-lg tracking-wider">
          INK / ADMIN
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
              pathname === href
                ? "bg-black text-white"
                : "text-muted hover:bg-surface",
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 border-t border-border p-4 text-sm text-muted hover:text-black"
      >
        <LogOut size={16} />
        Выйти
      </button>
    </aside>
  );
}
