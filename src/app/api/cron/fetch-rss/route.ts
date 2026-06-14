import { NextResponse } from "next/server";
import { fetchRSS } from "@/lib/fetchers/rss";

export async function GET() {
  const result = await fetchRSS();
  return NextResponse.json({ ok: true, ...result });
}
