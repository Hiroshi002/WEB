import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get("admin");

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // ❌ ไม่มี cookie และไม่ใช่หน้า login
  if (isAdminRoute && !adminCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // ✅ มี cookie แต่เข้า login → เด้งเข้าหน้า admin
  if (isLoginPage && adminCookie) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
