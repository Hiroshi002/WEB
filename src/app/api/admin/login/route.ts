import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "กรอกข้อมูลไม่ครบ" },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("username, password_hash, role")
      .eq("username", username)
      .single();

    console.log("LOGIN INPUT:", username, password);
    console.log("DB ADMIN:", admin);
    console.log("DB ERROR:", error);

    if (!admin) {
      return NextResponse.json(
        { message: "ไม่พบผู้ใช้" },
        { status: 401 }
      );
    }

    // ✅ เปรียบเทียบ bcrypt
    const isMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set(
      "admin",
      JSON.stringify({
        username: admin.username,
        role: admin.role,
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
      }
    );

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
