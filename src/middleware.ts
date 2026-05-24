/**
 * «Охранник» сайта: проверяет вход ДО открытия страницы.
 * — /kabinet — только для залогиненных
 * — /admin — только ADMIN и MANAGER (иначе редирект на /vhod)
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/constants";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Обычный USER не должен попадать в админку даже если вошёл
    if (isAdminRoute) {
      const role = token?.role as string | undefined;
      if (!isAdminRole(role)) {
        return NextResponse.redirect(new URL("/vhod?callbackUrl=/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        if (req.nextUrl.pathname.startsWith("/kabinet")) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/kabinet/:path*"],
};
