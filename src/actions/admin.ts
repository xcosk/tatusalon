/**
 * АДМИН-ПАНЕЛЬ (/admin)
 *
 * Все функции требуют роль ADMIN или MANAGER (requireAdmin).
 * Здесь: CRUD эскизов, мастеров, блога, модерация отзывов, статусы заявок.
 *
 * Отзывы: setReviewPublished — показать/скрыть на сайте; deleteReview — мягкое удаление
 */
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/constants";
import slugify from "slugify";
import type { BookingStatus, ContactStatus, Role } from "@prisma/client";

/** Бросает ошибку, если в сессии нет админа/менеджера */
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export type AdminResult = { success: boolean; error?: string };

export async function deleteWork(id: string): Promise<AdminResult> {
  await requireAdmin();
  await prisma.tattooWork.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath("/admin/works");
  revalidatePath("/eskizy");
  return { success: true };
}

export async function upsertWork(data: {
  id?: string;
  title: string;
  description?: string;
  style?: string;
  priceFrom?: number;
  imageUrl: string;
  categoryId?: string;
  artistId?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}): Promise<AdminResult> {
  await requireAdmin();
  const slug = slugify(data.title, { lower: true, strict: true, locale: "ru" });
  if (data.id) {
    await prisma.tattooWork.update({ where: { id: data.id }, data: { ...data, slug } });
  } else {
    await prisma.tattooWork.create({ data: { ...data, slug } });
  }
  revalidatePath("/admin/works");
  revalidatePath("/eskizy");
  return { success: true };
}

export async function upsertArtist(data: {
  id?: string;
  name: string;
  bio?: string;
  styles: string[];
  photoUrl?: string;
  isActive?: boolean;
}): Promise<AdminResult> {
  await requireAdmin();
  const slug = slugify(data.name, { lower: true, strict: true, locale: "ru" });
  if (data.id) {
    await prisma.tattooArtist.update({ where: { id: data.id }, data: { ...data, slug } });
  } else {
    await prisma.tattooArtist.create({ data: { ...data, slug } });
  }
  revalidatePath("/admin/masters");
  return { success: true };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<AdminResult> {
  await requireAdmin();
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus,
): Promise<AdminResult> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function upsertBlogPost(data: {
  id?: string;
  title: string;
  excerpt?: string;
  content: string;
  coverUrl?: string;
  isPublished?: boolean;
}): Promise<AdminResult> {
  await requireAdmin();
  const slug = slugify(data.title, { lower: true, strict: true, locale: "ru" });
  const payload = {
    ...data,
    slug,
    publishedAt: data.isPublished ? new Date() : null,
  };
  if (data.id) {
    await prisma.blogPost.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.blogPost.create({ data: payload });
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateUserRole(id: string, role: Role): Promise<AdminResult> {
  const session = await requireAdmin();
  if (session.user.role !== "ADMIN") {
    return { success: false, error: "Только администратор" };
  }
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

/** После смены статуса отзыва обновляем страницы, где они показываются */
function revalidateReviewPaths() {
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/o-nas");
  revalidatePath("/kabinet");
}

export async function upsertReview(data: {
  id?: string;
  author: string;
  content: string;
  rating: number;
  isPublished?: boolean;
  artistId?: string;
}): Promise<AdminResult> {
  await requireAdmin();
  if (data.id) {
    await prisma.review.update({ where: { id: data.id }, data });
  } else {
    await prisma.review.create({
      data: { ...data, isPublished: data.isPublished ?? false },
    });
  }
  revalidateReviewPaths();
  return { success: true };
}

export async function setReviewPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminResult> {
  await requireAdmin();
  await prisma.review.update({
    where: { id },
    data: { isPublished },
  });
  revalidateReviewPaths();
  return { success: true };
}

export async function deleteReview(id: string): Promise<AdminResult> {
  await requireAdmin();
  await prisma.review.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidateReviewPaths();
  return { success: true };
}

export async function upsertCategory(data: {
  id?: string;
  name: string;
  description?: string;
}): Promise<AdminResult> {
  await requireAdmin();
  const slug = slugify(data.name, { lower: true, strict: true, locale: "ru" });
  if (data.id) {
    await prisma.category.update({ where: { id: data.id }, data: { ...data, slug } });
  } else {
    await prisma.category.create({ data: { ...data, slug } });
  }
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function upsertGalleryItem(data: {
  id?: string;
  title?: string;
  imageUrl: string;
  categoryId?: string;
  isPublished?: boolean;
}): Promise<AdminResult> {
  await requireAdmin();
  if (data.id) {
    await prisma.galleryItem.update({ where: { id: data.id }, data });
  } else {
    await prisma.galleryItem.create({ data });
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/galereya");
  return { success: true };
}

export async function updateSiteSettings(data: {
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  mapEmbedUrl?: string;
  socialTelegram?: string;
  socialInstagram?: string;
}): Promise<AdminResult> {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "default" },
    data,
  });
  revalidatePath("/admin/settings");
  revalidatePath("/kontakty");
  return { success: true };
}
