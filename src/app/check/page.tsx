"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { loadUsers, User } from "@/lib/userStore";

/* ================= ROLE ORDER ================= */

const ROLE_ORDER = [
  "HEAD",
  "LEAD",
  "EXCLUSIVE",
  "S.VIP",
  "VIP",
  "CONSTANCY",
];

/* ================= ROLE COLORS ================= */

const ROLE_COLOR: Record<string, string> = {
  HEAD: "text-red-400",
  "LEAD": "text-purple-400",
  EXCLUSIVE: "text-amber-400",
  "S.VIP": "text-pink-400",
  VIP: "text-green-400",
  CONSTANCY: "text-blue-400",
};

/* ================= ROLE BADGE ================= */

const ROLE_BADGE: Record<string, string> = {
  HEAD: "border-red-500 text-red-400 bg-red-500/10",
  LEAD: "border-purple-500 text-purple-400 bg-purple-500/10",
  // SUPPORT: "border-indigo-500 text-indigo-400 bg-indigo-500/10",
  EXCLUSIVE: "border-amber-500 text-amber-400 bg-amber-500/10",
  "S.VIP": "border-pink-500 text-pink-400 bg-pink-500/10",
  VIP: "border-green-500 text-green-400 bg-green-500/10",
  CONSTANCY: "border-blue-500 text-blue-400 bg-blue-500/10",
};

/* ================= ROLE GROUP ================= */

const mapRoleToGroup = (role: string) => {
  if (role === "LEAD") {
    return "LEAD";
  }
  return role;
};

/* ================= PAGE ================= */

export default function CheckPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
  const es = new EventSource("/api/members/stream");

  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch {
      // ❌ ข้ามข้อมูลที่ยังไม่สมบูรณ์
    }
  };

  return () => es.close();
}, []);

  const grouped = useMemo(() => {
    const filtered = query
      ? users.filter((u) =>
          u.name.toLowerCase().includes(query.toLowerCase())
        )
      : users;

    const map: Record<string, User[]> = {};

    for (const u of filtered) {
      const group = mapRoleToGroup(u.role);
      if (!map[group]) map[group] = [];
      map[group].push(u);
    }

    return map;
  }, [query, users]);

  return (
    <main className="relative min-h-screen bg-[#030307] text-white">

      {/* BACK HOME */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2
            text-sm tracking-widest
            border border-purple-500/40 rounded-lg
            text-purple-300 bg-purple-500/10 backdrop-blur
            transition hover:bg-purple-500/20
            hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <ArrowLeft size={16} />
          HOME
        </Link>
      </div>

      {/* SEARCH */}
      <div className="fixed top-6 right-6 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหารายชื่อ..."
            className="cyber-input pl-10 w-64"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="neon-text text-4xl tracking-[0.4em] text-center mb-20">
          CONSTANCY
        </h1>

        <div className="space-y-16">
          {ROLE_ORDER.map((role) => {
            const list = grouped[role];
            if (!list || list.length === 0) return null;

            return (
              <section key={role}>
                <h2
                  className={`mb-6 text-sm tracking-[0.35em] uppercase ${
                    ROLE_COLOR[role]
                  }`}
                >
                  {role}
                </h2>

                <div className="cyber-panel space-y-4">
                  {list.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelected(u)}
                      className="cyber-card w-full text-left px-6 py-5 transition hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg">{u.name}</p>
                          <p className="text-xs text-gray-400 tracking-widest">
                            JOINED {u.joined}
                          </p>
                        </div>

                        <span
                          className={
                            u.status === "ACTIVE"
                              ? "status status-green"
                              : "status status-red"
                          }
                        >
                          {u.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="cyber-modal w-full max-w-md p-8">
            <h2 className="text-2xl neon-text mb-2">
              {selected.name}
            </h2>

            <span
              className={`inline-block mb-6 px-4 py-1 text-xs tracking-widest border rounded-full ${
                ROLE_BADGE[selected.role] ??
                "border-gray-500 text-gray-300"
              }`}
            >
              {selected.role}
            </span>

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">ตำแหน่ง:</span>{" "}
                <span className="text-purple-300">
                  {selected.title}
                </span>
              </p>

              <p>
                <span className="text-gray-400">สถานะ:</span>{" "}
                <span
                  className={
                    selected.status === "ACTIVE"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {selected.status}
                </span>
              </p>

              <p>
                <span className="text-gray-400">เข้าร่วมเมื่อ:</span>{" "}
                {selected.joined}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="cyber-btn mt-8 w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
