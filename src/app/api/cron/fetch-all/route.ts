import { NextResponse } from "next/server";
import { fetchGNews } from "@/lib/fetchers/gnews";
import { fetchYouTube } from "@/lib/fetchers/youtube";
import { fetchRSS } from "@/lib/fetchers/rss";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const country = searchParams.get("country");
  const opts = lang && country ? { lang, country } : undefined;
  const [gnews, yt, rss] = await Promise.allSettled([
    fetchGNews(opts),
    fetchYouTube(opts),
    fetchRSS(),
  ]);
  return NextResponse.json({
    ok: true,
    gnews: gnews.status === "fulfilled" ? gnews.value : { error: "failed" },
    youtube: yt.status === "fulfilled" ? yt.value : { error: "failed" },
    rss: rss.status === "fulfilled" ? rss.value : { error: "failed" },
  });
}
