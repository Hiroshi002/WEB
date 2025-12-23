"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="cyber-modal w-full max-w-sm p-8">
        <h1 className="neon-text text-xl mb-6 text-center">
          ADMIN LOGIN
        </h1>

        <input
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="cyber-input w-full mb-3"
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="cyber-input w-full mb-4"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <button onClick={submit} className="cyber-btn w-full">
          เข้าสู่ระบบ
        </button>
      </div>
    </main>
  );
}
