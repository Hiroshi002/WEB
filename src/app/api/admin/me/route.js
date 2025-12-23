import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = cookies().get("admin");
  if (!admin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json(JSON.parse(admin.value));
}
