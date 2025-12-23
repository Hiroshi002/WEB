import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin");

  if (!adminCookie) redirect("/admin/login");

  let admin;
  try {
    admin = JSON.parse(adminCookie.value);
  } catch {
    redirect("/admin/login");
  }

  return (
    <main className="relative min-h-screen bg-[#030307] text-white px-6 py-20">

      {/* 🔙 HOME BUTTON */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="
            flex items-center gap-2 px-4 py-2
            text-sm tracking-widest
            border border-purple-500/40 rounded-lg
            text-purple-300 bg-purple-500/10 backdrop-blur
            transition hover:bg-purple-500/20
            hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]
          "
        >
          <ArrowLeft size={16} />
          HOME
        </Link>
      </div>

      {/* CONTENT */}
      <h1 className="neon-text text-3xl text-center mb-2">
        ADMIN PANEL
      </h1>

      <p className="text-center text-sm opacity-70 mb-10">
        Welcome, {admin.username} ({admin.role})
      </p>

      <div className="max-w-xl mx-auto space-y-4">
        <Link href="/admin/users" className="cyber-card p-6 block">
          จัดการรายชื่อสมาชิก
        </Link>

        {admin.role === "HEAD" && (
          <Link href="/admin/admins" className="cyber-card p-6 block">
            จัดการแอดมิน
          </Link>
        )}

        <form action="/api/admin/logout" method="POST">
          <button className="cyber-card p-6 w-full text-left">
            ออกจากระบบ
          </button>
        </form>
      </div>
    </main>
  );
}
