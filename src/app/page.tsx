"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminTopBar from "@/components/AdminTopBar";

const menus = [
  { title: "CHECK", desc: "ตรวจสอบรายชื่อ", href: "/check" },
  { title: "ADMIN", desc: "จัดการระบบ", href: "/admin" },
  { title: "SUPPORT", desc: "ฝ่ายสนับสนุน", href: "/support" },
];

type Particle = {
  left: number;
  dur: number;
  delay: number;
};

export default function Home() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Cursor Glow
  useEffect(() => {
    const move = (e: MouseEvent) =>
      setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Random Glitch
  useEffect(() => {
    const i = setInterval(
      () => setGlitch((g) => !g),
      1800 + Math.random() * 3000
    );
    return () => clearInterval(i);
  }, []);

  // ✅ Generate particles ONLY on client
  useEffect(() => {
    const generated = Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      dur: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
    setParticles(generated);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#030307] text-white overflow-hidden">
      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(700px at ${pos.x}px ${pos.y}px, rgba(168,85,247,0.2), transparent 45%)`,
        }}
      />

      {/* FX */}
      <div className="absolute inset-0 ambient-glow pointer-events-none" />
      <div className="absolute inset-0 scanline pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />
      <div className="absolute inset-0 noise opacity-25" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1
          className={`logo-neon text-6xl md:text-8xl font-black tracking-[0.4em] ${
            glitch ? "logo-glitch" : ""
          }`}
        >
          CONSTANCY
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 leading-relaxed">
          Cyber-grade verification system
          <br />
          built for stability, precision, and power
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {menus.map((m, i) => (
            <Link key={i} href={m.href} className="cyber-card magnetic">
              <h3 className="text-2xl font-bold tracking-widest">
                {m.title}
              </h3>
              <p className="mt-3 text-gray-400 text-sm">
                {m.desc}
              </p>
              <span className="mt-8 inline-block text-xs tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 transition">
                ENTER →
              </span>
            </Link>
          ))}
        </div>

        <span className="mt-28 text-xs tracking-[0.5em] text-gray-600">
          POWERED BY CONSTANCY
        </span>
      </div>
    </main>
  );
}
