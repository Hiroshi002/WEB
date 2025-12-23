"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        cache: "no-store", // ❗ กัน cache
      });
    } finally {
      router.replace("/admin/login"); // ❗ กลับหน้า login ชัวร์
      router.refresh();               // ❗ clear state / cache
    }
  };

  return (
    <button
      onClick={logout}
      className="cyber-card p-6 w-full text-left"
    >
      ออกจากระบบ
    </button>
  );
}
