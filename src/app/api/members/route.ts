import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * ❗ สำคัญมาก
 * ปิด cache ของ Next.js / Vercel
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ================= GET ================= */
// ดึง members ทั้งหมด
export async function GET() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("joined", { ascending: false });

  if (error) {
    console.error("GET members error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

/* ================= POST ================= */
// เพิ่ม member ใหม่
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("members")
    .insert({
      name: body.name,
      title: body.title || "",
      role: body.role || "CONSTANCY",
      status: body.status || "ACTIVE",
    })
    .select()
    .single();

  if (error) {
    console.error("POST member error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/* ================= PUT ================= */
// แก้ไข member
export async function PUT(req: Request) {
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("members")
    .update({
      name: body.name,
      title: body.title,
      role: body.role,
      status: body.status,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("PUT member error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

/* ================= DELETE ================= */
// ลบ member
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE member error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
