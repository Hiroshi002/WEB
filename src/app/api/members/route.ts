// src/app/api/admin/members/route.ts  (หรือตำแหน่งเดิมของคุณ)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";  // ปรับ path ให้ตรงกับที่คุณสร้าง

/* ================= GET ================= */
// ดึง members ทั้งหมดมาแสดงในตาราง
export async function GET() {
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .order("joined", { ascending: false });  // เรียงจากใหม่ไปเก่า (หรือเปลี่ยนได้)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members || []);
}

/* ================= POST ================= */
// เพิ่ม member ใหม่
export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("members")
    .insert([
      {
        name: body.name,
        title: body.title || "",
        role: body.role || "CONSTANCY",
        status: body.status || "ACTIVE",
        // joined จะ gen อัตโนมัติจาก default now() ใน table
      },
    ])
    .select()  // คืนข้อมูล member ที่เพิ่มใหม่กลับมา
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ================= PUT ================= */
// แก้ไข member (เช่น เปลี่ยน role, status, title)
export async function PUT(req: Request) {
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("members")
    .update({
      name: body.name,
      title: body.title,
      role: body.role,
      status: body.status,
      // updated_at ถ้าอยากมี สร้าง column เพิ่มใน table ได้
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

/* ================= DELETE ================= */
// ลบ member
export async function DELETE(req: Request) {
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
