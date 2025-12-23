import fs from "fs";
import path from "path";

export async function GET() {
  const encoder = new TextEncoder();
  const filePath = path.join(process.cwd(), "src/data/members.json");

  let controller: ReadableStreamDefaultController;
  let closed = false; // ✅ ตัวกัน enqueue หลังปิด

  const stream = new ReadableStream({
    start(c) {
      controller = c;

      const send = () => {
        if (closed) return;

        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const json = JSON.parse(raw);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(json)}\n\n`)
          );
        } catch {
          // ❌ ข้ามกรณีไฟล์ยังเขียนไม่เสร็จ
        }
      };

      send();

      const watcher = fs.watch(filePath, () => {
        setTimeout(send, 80);
      });

      return () => {
        closed = true;
        watcher.close();
        try {
          controller.close();
        } catch {}
      };
    },

    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
