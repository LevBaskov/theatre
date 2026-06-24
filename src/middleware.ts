import { auth } from "src/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Публичные маршруты
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/performance/:path*"];
  
  // Админ-маршруты
  const adminRoutes = ["/admin/:path*"];

  // Если маршрут публичный — пропускаем
  if (publicRoutes.some((route) => pathname.match(`^${route.replace(":path*", ".*")}$`))) {
    return NextResponse.next();
  }

  // Если маршрут админский, а пользователь не админ — редирект
  if (adminRoutes.some((route) => pathname.match(`^${route.replace(":path*", ".*")}$`))) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Если маршрут защищён, а пользователь не авторизован — редирект на вход
  if (!isLoggedIn && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};