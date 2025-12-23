"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ================= TYPES ================= */

export type User = {
  id: string;
  name: string;
  role: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  joined: string;
};

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
  LEAD: "text-purple-400",
  EXCLUSIVE: "text-amber-400",
  "S.VIP": "text-pink-400",
  VIP: "text-green-400",
  CONSTANCY: "text-blue-400",
};

/* ================= ROLE BADGE ================= */

const ROLE_BADGE: Record<string, string> = {
  HEAD: "border-red-500 text-red-400 bg-red-500/10",
  LEAD: "border-purple-500 text-purple-400 bg-purple-500/10",
  EXCLUSIVE: "border-amber-500 text-amber-400 bg-amber-500/10",
  "S.VIP": "border-pink-500 text-pink-400 bg-pink-500/10",
  VIP: "border-green-500 text-green-400 bg-green-500/10",
  CONSTANCY: "border-blue-500 text-blue-400 bg-blue-500/10",
};

/* ================= PAGE ================= */

export default function CheckPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  /* ===== INITIAL LOAD + REALTIME ===== */
  useEffect(() => {
  let ignore = false;

  const load = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("joined", { ascending: false });

    if (!ignore && data) {
      setUsers(data);
    }
  };

  // โหลดครั้งแรก
  load();

  // กัน realtime หลุด
  const interval = setInterval(load, 3000);

  const channel = supabase
    .channel("members-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "members" },
      (payload) => {
        if (payload.eventType === "DELETE") {
          // ⚡ ลบทันที
          setUsers((prev) =>
            prev.filter((u) => u.id !== payload.old.id)
          );
          return;
        }

        // INSERT / UPDATE → sync
        load();
      }
    )
    .subscribe();

  return () => {
    ignore = true;
    clearInterval(interval);
    supabase.removeChannel(channel);
  };
}, []);

  /* ===== FILTER + GROUP ===== */
  const grouped = useMemo(() => {
    const filtered = query
      ? users.filter((u) =>
          u.name.toLowerCase().includes(query.toLowerCase())
        )
      : users;

    return filtered.reduce<Record<string, User[]>>((acc, u) => {
      if (!acc[u.role]) acc[u.role] = [];
      acc[u.role].push(u);
      return acc;
    }, {});
  }, [query, users]);

  return (
    <main className="relative min-h-screen bg-[#030307] text-white">
      {/* BACK */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm
          border border-purple-500/40 rounded-lg
          text-purple-300 bg-purple-500/10"
        >
          <ArrowLeft size={16} />
          HOME
        </Link>
      </div>

      {/* SEARCH */}
      <div className="fixed top-6 right-6 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหารายชื่อ..."
            className="cyber-input pl-10 w-64"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="neon-text text-4xl text-center mb-20">
          CONSTANCY
        </h1>

        {ROLE_ORDER.map((role) => {
          const list = grouped[role];
          if (!list?.length) return null;

          return (
            <section key={role} className="mb-16">
              <h2 className={`mb-6 text-sm ${ROLE_COLOR[role]}`}>
                {role}
              </h2>

              <div className="space-y-4">
                {list.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className="cyber-card w-full px-6 py-5 text-left"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg">{u.name}</p>
                        <p className="text-xs text-gray-400">
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

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="cyber-modal p-8 max-w-md w-full">
            <h2 className="text-2xl mb-2">{selected.name}</h2>

            <span
              className={`inline-block mb-6 px-4 py-1 border rounded-full ${ROLE_BADGE[selected.role]}`}
            >
              {selected.role}
            </span>

            <p>ตำแหน่ง: {selected.title}</p>
            <p>สถานะ: {selected.status}</p>
            <p>เข้าร่วม: {selected.joined}</p>

            <button
              onClick={() => setSelected(null)}
              className="cyber-btn mt-6 w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
