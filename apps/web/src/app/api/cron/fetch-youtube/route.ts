import { NextResponse } from "next/server";
import { fetchYouTube } from "@/lib/content/fetchers/youtube";

export async function GET() {
  const result = await fetchYouTube();
  return NextResponse.json({ ok: true, ...result });
}
