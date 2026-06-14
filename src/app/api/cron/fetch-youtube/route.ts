import { NextResponse } from "next/server";
import { fetchYouTube } from "@/lib/fetchers/youtube";

export async function GET() {
  const result = await fetchYouTube();
  return NextResponse.json({ ok: true, ...result });
}
