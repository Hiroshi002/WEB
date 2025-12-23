import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import admins from "@/data/admins.json";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const admin = admins.find(
    (a) => a.username === username && a.password === password
  );

  if (!admin) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // แก้ตรงนี้: await cookies() ก่อน แล้วค่อย set
  const cookieStore = await cookies();
  cookieStore.set("admin", JSON.stringify({
    username: admin.username,
    role: admin.role,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  // เพิ่ม secure ใน production เพื่อความปลอดภัย
    path: "/",
    maxAge: 60 * 60 * 24 * 7,  // เช่น 7 วัน (แนะนำให้ตั้ง expiration)
    sameSite: "strict",       // ป้องกัน CSRF
  });

  return NextResponse.json({ success: true });
}
