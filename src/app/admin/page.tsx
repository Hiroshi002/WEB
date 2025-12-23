import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "./logout-button";
import { createClient } from "@supabase/supabase-js";

// ❗ server only (อ่านอย่างเดียว)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin");

  // ❌ ไม่มี cookie
  if (!adminCookie) redirect("/admin/login");

  let admin: { username: string; role: string };

  try {
    admin = JSON.parse(adminCookie.value);
  } catch {
    // ❌ cookie พัง → ให้ route ลบ
    redirect("/api/admin/logout");
  }

  // 🔥 เช็ค DB ทุกครั้ง
  const { data, error } = await supabase
    .from("admins")
    .select("username, role")
    .eq("username", admin.username)
    .single();

  if (error || !data) {
    // ❌ admin ถูกลบออกจาก DB
    redirect("/api/admin/logout");
  }

  return (
    <main className="relative min-h-screen bg-[#030307] text-white px-6 py-20">
      {/* 🔙 HOME */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="
            flex items-center gap-2 px-4 py-2
            text-sm tracking-widest
            border border-purple-500/40 rounded-lg
            text-purple-300 bg-purple-500/10 backdrop-blur
            transition hover:bg-purple-500/20
          "
        >
          <ArrowLeft size={16} />
          HOME
        </Link>
      </div>

      <h1 className="neon-text text-3xl text-center mb-2">
        ADMIN PANEL
      </h1>

      <p className="text-center text-sm opacity-70 mb-10">
        Welcome, {data.username} ({data.role})
      </p>

      <div className="max-w-xl mx-auto space-y-4">
        <Link href="/admin/users" className="cyber-card p-6 block">
          จัดการรายชื่อสมาชิก
        </Link>

        {data.role === "HEAD" && (
          <Link href="/admin/admins" className="cyber-card p-6 block">
            จัดการแอดมิน
          </Link>
        )}

        <LogoutButton />
      </div>
    </main>
  );
}
