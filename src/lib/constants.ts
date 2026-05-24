/**
 * Общие константы сайта: название, пункты меню, слоты времени для записи, роли админов.
 * Меню в шапке — NAV_LINKS. Проверка «это админ?» — isAdminRole().
 */

export const SITE_NAME = "INK / STUDIO";
export const SITE_DESCRIPTION =
  "Авторская студия татуировки в Москве. Работаем медленно, чисто и только с тем, во что верим.";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/eskizy", label: "Эскизы" },
  { href: "/zapis", label: "Запись" },
  { href: "/o-nas", label: "О нас" },
] as const;

export const STYLE_TAGS = [
  "Минимализм",
  "Блэкворк",
  "Геометрия",
  "Дотворк",
  "Реализм",
  "Япония",
  "Олдскул",
  "Графика",
] as const;

export const BOOKING_TIME_SLOTS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
] as const;

import type { Role } from "@prisma/client";

// Только эти роли видят /admin
export const ADMIN_ROLES = ["ADMIN", "MANAGER"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/** true, если пользователь может заходить в админ-панель */
export function isAdminRole(
  role: Role | string | undefined | null,
): role is AdminRole {
  return role === "ADMIN" || role === "MANAGER";
}
