import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const admin = req.cookies.get("admin");
  const { pathname } = req.nextUrl;

  // หน้า public
  if (
    pathname === "/" ||
    pathname.startsWith("/check") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // หน้า admin ต้องมี cookie
  if (!admin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
