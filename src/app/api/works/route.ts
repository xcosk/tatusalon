import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPublishedWorks } from "@/services/works";
import { getFavoriteWorkIds } from "@/services/favorites";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const categorySlug = searchParams.get("category") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  const session = await getServerSession(authOptions);
  const [result, favoriteWorkIds] = await Promise.all([
    getPublishedWorks({ page, pageSize: 12, categorySlug, search }),
    session?.user?.id ? getFavoriteWorkIds(session.user.id) : Promise.resolve([]),
  ]);

  return NextResponse.json({ ...result, favoriteWorkIds });
}
