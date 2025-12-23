import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete("admin");
  return NextResponse.redirect(new URL("/", "http://localhost:3000"));
}
