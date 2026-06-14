import { NextResponse } from "next/server";
import { fetchGNews } from "@/lib/fetchers/gnews";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = await fetchGNews({
    lang: searchParams.get("lang") || "id",
    country: searchParams.get("country") || "id",
  });
  return NextResponse.json({ ok: true, ...result });
}
