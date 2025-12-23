"use client";

import AdminDropdown from "@/components/AdminDropdown";

export default function AdminTopBar({
  title,
  showSearch = false,
  search,
  setSearch,
}: {
  title: string;
  showSearch?: boolean;
  search?: string;
  setSearch?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
      <h1 className="text-3xl font-extrabold tracking-wide text-cyan-400 flex items-center gap-3">
        <span className="drop-shadow-[0_0_12px_#22d3ee]">👑</span>
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {showSearch && (
          <input
            placeholder="ค้นหา..."
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
            className="
              bg-black/60 px-4 py-2 rounded-full
              border border-violet-400/30
              focus:border-violet-400 outline-none
              text-sm w-64
              shadow-[0_0_15px_#7c3aed]
            "
          />
        )}

        <AdminDropdown />
      </div>
    </div>
  );
}
