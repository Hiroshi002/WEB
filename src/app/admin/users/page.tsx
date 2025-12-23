"use client";

import { useEffect, useState } from "react";
import AdminDropdown from "@/components/AdminDropdown";
import AdminTopBar from "@/components/AdminTopBar";

const ROLES = [
  "HEAD",
  "LEAD / SUPPORT",
  "EXCLUSIVE",
  "S.VIP",
  "VIP",
  "CONSTANCY",
];

const ROLE_COLORS: Record<string, string> = {
  HEAD: "text-red-400 shadow-[0_0_10px_#f87171]",
  "LEAD / SUPPORT": "text-purple-400 shadow-[0_0_10px_#c084fc]",
  EXCLUSIVE: "text-yellow-400 shadow-[0_0_10px_#facc15]",
  "S.VIP": "text-pink-400 shadow-[0_0_10px_#f472b6]",
  VIP: "text-green-400 shadow-[0_0_10px_#4ade80]",
  CONSTANCY: "text-cyan-400 shadow-[0_0_10px_#22d3ee]",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    title: "",
    role: "CONSTANCY",
    status: "ACTIVE",
  });

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/members", { cache: "no-store" });
    setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function addUser() {
    if (!form.name.trim()) return;

    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", title: "", role: "CONSTANCY", status: "ACTIVE" });
    loadUsers();
  }

  async function updateUser(updated: any) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );

    await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  async function deleteUser(id: number) {
    if (!confirm("ลบผู้ใช้นี้ใช่หรือไม่?")) return;

    setUsers((prev) => prev.filter((u) => u.id !== id));

    await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">

      {/* ===== HEADER (z-30) ===== */}
      <div className="relative z-30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
        <h1 className="text-3xl font-extrabold text-cyan-400 flex items-center gap-3">
          <span className="drop-shadow-[0_0_12px_#22d3ee]">👑</span>
          ADMIN USERS
        </h1>

        <div className="flex items-center gap-4">
          <input
            placeholder="ค้นหารายชื่อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              bg-black/60 px-4 py-2 rounded-full
              border border-violet-400/30
              focus:border-violet-400 outline-none
              text-sm w-64
              shadow-[0_0_15px_#7c3aed]
            "
          />

          <AdminDropdown />
        </div>
      </div>

      {/* ===== ADD USER (z-10) ===== */}
      <div className="relative z-10 bg-zinc-900/60 p-6 rounded-2xl mb-12 border border-violet-500/20 shadow-[0_0_50px_#4c1d9555]">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

        <h2 className="mb-5 text-violet-300 font-semibold">
          ➕ เพิ่มสมาชิกใหม่
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="ชื่อ"
            className="bg-black/60 px-3 py-2 rounded-lg border border-zinc-700 focus:border-violet-400 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="ตำแหน่ง / Title"
            className="bg-black/60 px-3 py-2 rounded-lg border border-zinc-700 focus:border-violet-400 outline-none"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <select
            className="bg-black/60 px-3 py-2 rounded-lg border border-zinc-700 focus:border-violet-400"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={addUser}
            className="bg-violet-600 hover:bg-violet-500 rounded-lg font-semibold shadow-[0_0_20px_#8b5cf6]"
          >
            เพิ่ม
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800/70 text-xs text-violet-300">
            <tr>
              <th className="p-4 text-left">ชื่อ</th>
              <th>ตำแหน่ง</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t border-zinc-800">
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="text-zinc-400">{u.title}</td>
                <td>
                  <select
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-black border border-zinc-700 ${ROLE_COLORS[u.role]}`}
                    value={u.role}
                    onChange={(e) =>
                      updateUser({ ...u, role: e.target.value })
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={u.status}
                    onChange={(e) =>
                      updateUser({ ...u, status: e.target.value })
                    }
                    className={`px-4 py-1 rounded-full text-xs font-bold border ${
                      u.status === "ACTIVE"
                        ? "text-green-400 border-green-500/40 bg-green-500/10"
                        : "text-red-400 border-red-500/40 bg-red-500/10"
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </td>
                <td className="text-right p-4">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-4 text-center text-violet-400 animate-pulse">
            กำลังโหลดข้อมูล...
          </div>
        )}
      </div>
    </div>
  );
}
