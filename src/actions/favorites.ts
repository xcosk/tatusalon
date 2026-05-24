/**
 * ИЗБРАННОЕ (сердечко на карточках эскизов)
 * toggleFavorite — добавить или убрать эскиз из избранного (нужен вход).
 * Список в кабинете читается напрямую из БД на странице kabinet/page.tsx
 */
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(workId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Войдите в аккаунт" };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_workId: { userId: session.user.id, workId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, workId },
    });
  }

  revalidatePath("/eskizy", "layout");
  revalidatePath("/kabinet");
  return { success: true, favorited: !existing };
}
