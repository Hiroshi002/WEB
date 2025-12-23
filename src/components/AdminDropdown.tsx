"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function AdminDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="
          px-4 py-2 rounded-full text-sm
          bg-violet-500/10 border border-violet-400/30
          text-violet-300 hover:bg-violet-500/20
          shadow-[0_0_15px_#a78bfa]
        "
      >
        ☰ เมนู
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-44
            bg-zinc-900/95
            border border-violet-400/30
            rounded-xl
            shadow-[0_0_40px_#7c3aed]
            backdrop-blur
          "
        >
          <Link href="/" className="block px-4 py-3 hover:bg-violet-500/10">
            🏠 HOME
          </Link>
          <Link href="/check" className="block px-4 py-3 hover:bg-violet-500/10">
            📋 CHECK LIST
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 hover:bg-violet-500/10">
            👑 ADMIN USERS
          </Link>
        </div>
      )}
    </div>
  );
}
