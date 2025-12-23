import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

/* 🔥 FIX PATH */
const filePath = path.join(process.cwd(), "src/data/members.json");

/* ================= UTIL ================= */
function readJSON() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return data.trim() ? JSON.parse(data) : [];
}

function writeJSON(data: any[]) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function now() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/* ================= GET ================= */
export async function GET() {
  return NextResponse.json(readJSON());
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const members = readJSON();
  const body = await req.json();

  const maxId = members.length
    ? Math.max(...members.map((m: any) => Number(m.id)))
    : 0;

  const newMember = {
    id: maxId + 1,          // ✅ ID เรียง 1,2,3,...
    name: body.name,
    role: body.role,
    title: body.title || "",
    status: body.status || "ACTIVE",
    joined: now(),          // ✅ เวลาจริงตอนเพิ่ม
  };

  members.push(newMember);
  writeJSON(members);

  return NextResponse.json(newMember);
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  const members = readJSON();
  const body = await req.json();

  const index = members.findIndex((m: any) => m.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  members[index] = {
    ...members[index],
    ...body,
    updated: now(),       // (optional) เวลาแก้ไข
  };

  writeJSON(members);
  return NextResponse.json(members[index]);
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const members = readJSON();
  const { id } = await req.json();

  const filtered = members.filter((m: any) => m.id !== id);
  writeJSON(filtered);

  return NextResponse.json({ success: true });
}
