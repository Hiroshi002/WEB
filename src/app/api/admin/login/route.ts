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

  cookies().set(
    "admin",
    JSON.stringify({
      username: admin.username,
      role: admin.role,
    }),
    {
      httpOnly: true,
      path: "/",
    }
  );

  return NextResponse.json({ success: true });
}
