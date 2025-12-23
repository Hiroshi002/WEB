"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavDropdown({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          px-4 py-2 rounded-full text-sm
          bg-violet-500/10 border border-violet-400/30
          text-violet-300
          shadow-[0_0_15px_#8b5cf6]
          hover:bg-violet-500/20
        "
      >
        ☰ เมนู
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-48
            bg-black/90 backdrop-blur
            border border-violet-500/30
            rounded-xl overflow-hidden
            shadow-[0_0_30px_#7c3aed]
            z-50
          "
        >
          <MenuItem href="/" label="🏠 HOME" />
          <MenuItem href="/check" label="📋 รายชื่อ" />

          {isAdmin && (
            <MenuItem href="/admin/users" label="👑 ADMIN" />
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="
        block px-4 py-3 text-sm
        text-zinc-300 hover:text-violet-300
        hover:bg-violet-500/10
        transition
      "
    >
      {label}
    </Link>
  );
}
