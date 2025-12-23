import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // แก้ตรงนี้: await cookies() ก่อน
  const cookieStore = await cookies();
  cookieStore.delete("admin");

  // แนะนำให้ redirect ด้วย URL แบบ relative หรือใช้ request headers
  // เพราะ hardcode "http://localhost:3000" จะมีปัญหาตอน deploy จริง
  return NextResponse.redirect(new URL("/", process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));
  // หรือง่ายกว่านั้น (Vercel แนะนำวิธีนี้):
  // return NextResponse.redirect("/");
}

export async function GET() {
  // ถ้ามีการเรียกด้วย GET ด้วย ให้ทำเหมือนกัน
  const cookieStore = await cookies();
  cookieStore.delete("admin");
  return NextResponse.redirect("/");
}
