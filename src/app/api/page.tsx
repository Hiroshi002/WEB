export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold tracking-widest">
        CONSTANCY
      </h1>

      <p className="mt-4 text-gray-400">
        ระบบตรวจสอบรายชื่อ
      </p>

      <a
        href="/check"
        className="mt-8 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
      >
        เข้าไปตรวจสอบ
      </a>
    </main>
  );
}
