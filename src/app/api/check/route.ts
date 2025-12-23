import { NextResponse } from "next/server";

const names = [
  "Admin",
  "Constancy",
  "Krma",
];

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";

  const found = names.some(
    (n) => n.toLowerCase() === name.toLowerCase()
  );

  return NextResponse.json({ found });
}
