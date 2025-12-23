import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ❗ เปลี่ยนเป็น nodejs (Realtime + SSE เสถียรกว่า)

export async function GET() {
  const encoder = new TextEncoder();

  let channel: any = null;

  const stream = new ReadableStream({
    async start(controller) {
      /* ===== ส่งข้อมูลเริ่มต้น ===== */
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("joined", { ascending: false });

      if (error) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify(error.message)}\n\n`
          )
        );
        controller.close();
        return;
      }

      controller.enqueue(
        encoder.encode(
          `event: init\ndata: ${JSON.stringify(data ?? [])}\n\n`
        )
      );

      /* ===== Realtime ===== */
      channel = supabase
        .channel("members-stream")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "members",
          },
          (payload) => {
            controller.enqueue(
              encoder.encode(
                `event: update\ndata: ${JSON.stringify(payload)}\n\n`
              )
            );
          }
        )
        .subscribe();
    },

    cancel() {
      if (channel) {
        supabase.removeChannel(channel);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // กัน proxy buffer
    },
  });
}
