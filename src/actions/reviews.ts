/**
 * ОТЗЫВЫ (действия с сервера)
 *
 * submitReview — пользователь отправляет отзыв с /o-nas или /kabinet.
 * Отзыв сохраняется с isPublished: false и ждёт кнопки «Опубликовать» в /admin/reviews.
 *
 * Модерация (опубликовать / снять / удалить) — в actions/admin.ts
 */
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const reviewSchema = z.object({
  content: z
    .string()
    .min(20, "Минимум 20 символов")
    .max(2000, "Слишком длинный текст"),
  rating: z.coerce.number().int().min(1).max(5),
  artistId: z.string().optional(),
});

export type ActionResult = { success: boolean; error?: string };

export async function submitReview(
  data: z.infer<typeof reviewSchema>,
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Войдите, чтобы оставить отзыв" };
  }

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const limited = rateLimit(`review:${session.user.id}`, 5, 3600_000);
  if (!limited.success) {
    return { success: false, error: "Слишком много попыток. Попробуйте позже." };
  }

  // Не даём слать второй отзыв, пока первый на проверке
  const pending = await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      isPublished: false,
      deletedAt: null,
    },
  });
  if (pending) {
    return {
      success: false,
      error: "У вас уже есть отзыв на проверке. Дождитесь модерации.",
    };
  }

  if (parsed.data.artistId) {
    const artist = await prisma.tattooArtist.findFirst({
      where: {
        id: parsed.data.artistId,
        isActive: true,
        deletedAt: null,
      },
    });
    if (!artist) {
      return { success: false, error: "Мастер не найден" };
    }
  }

  const author =
    session.user.name?.trim() ||
    session.user.email?.split("@")[0] ||
    "Клиент";

  await prisma.review.create({
    data: {
      author,
      content: parsed.data.content,
      rating: parsed.data.rating,
      artistId: parsed.data.artistId || null,
      userId: session.user.id,
      isPublished: false, // на сайте не показываем, пока админ не одобрит
    },
  });

  // Обновляем кэш страниц, чтобы в кабинете сразу был статус «На проверке»
  revalidatePath("/kabinet");
  revalidatePath("/o-nas");
  revalidatePath("/admin/reviews");

  return { success: true };
}
