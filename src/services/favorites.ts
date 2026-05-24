/** ID эскизов в избранном у пользователя — для подсветки сердечка в каталоге */
import { prisma } from "@/lib/prisma";

export async function getFavoriteWorkIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { workId: true },
  });
  return favorites.map((f) => f.workId);
}
