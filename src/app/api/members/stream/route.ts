// src/app/api/members/stream/route.ts  (หรือตำแหน่งเดิมของคุณ)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";  // ปรับ path ให้ตรง

export const dynamic = "force-dynamic";  // สำคัญ! บังคับให้ route นี้เป็น dynamic
export const runtime = "edge";           // ใช้ Edge Runtime จะเร็วและเสถียรกว่า (แนะนำ)

export async function GET() {
  const encoder = new TextEncoder();

  // สร้าง ReadableStream สำหรับ SSE
  const stream = new ReadableStream({
    async start(controller) {
      // ดึงข้อมูลเริ่มต้นก่อน แล้วส่งให้ client
      const { data: initialData, error: initialError } = await supabase
        .from("members")
        .select("*")
        .order("joined", { ascending: false });

      if (initialError) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: initialError.message })}\n\n`)
        );
        controller.close();
        return;
      }

      // ส่งข้อมูลแรกสุด
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData || [])}\n\n`)
      );

      // ตั้ง Realtime subscription
      const channel = supabase
        .channel("members-changes")
        .on(
          "postgres_changes",
          {
            event: "*",         // รับทุก event: INSERT, UPDATE, DELETE
            schema: "public",
            table: "members",
          },
          (payload) => {
            // ส่ง payload ใหม่ให้ client ทุกคนที่กำลังเชื่อมต่อ
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
            );
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Supabase Realtime subscribed!");
          }
          if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            controller.close();
          }
        });

      // เมื่อ client ตัดการเชื่อมต่อ → unsubscribe
      return () => {
        supabase.removeChannel(channel);
        controller.close();
      };
    },

    cancel() {
      // Client disconnect
      console.log("Client disconnected from members stream");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",  // ถ้าใช้จาก frontend domain เดียว เปลี่ยนเป็น domain คุณแทน
    },
  });
}
