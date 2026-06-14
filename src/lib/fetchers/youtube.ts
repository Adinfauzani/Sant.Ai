import { prisma } from "@/lib/db";
import { classifyArticle } from "@/lib/classifier";

const YT_BASE = "https://www.googleapis.com/youtube/v3/search";

interface YTApiResponse {
  items?: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnails: { high?: { url: string }; default?: { url: string } };
      publishedAt: string;
    };
  }[];
}

interface YTStatsResponse {
  items?: {
    id: string;
    statistics: { viewCount?: string };
  }[];
}

async function fetchViewCounts(videoIds: string[]): Promise<Map<string, number>> {
  if (videoIds.length === 0) return new Map();
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return new Map();

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.slice(0, 50).join(",")}&part=statistics&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return new Map();
    const data: YTStatsResponse = await res.json();
    const map = new Map<string, number>();
    (data.items || []).forEach((item) => {
      map.set(item.id, parseInt(item.statistics?.viewCount || "0", 10));
    });
    return map;
  } catch {
    return new Map();
  }
}

interface FetchOptions { lang?: string; country?: string; }

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (res.ok) return res;
    } catch { if (i < retries - 1) await new Promise((r) => setTimeout(r, 2000)); }
  }
  return fetch(url);
}

const YT_LOCALES: FetchOptions[] = [
  { lang: "id", country: "id" },
  { lang: "en", country: "us" },
];

async function fetchYouTubeForLocale(
  sourceId: string,
  locale: FetchOptions,
  keywords: { keyword: string }[],
  apiKey: string,
): Promise<{ inserted: number; skipped: number }> {
  const lang = locale.lang!;
  const region = locale.country!.toUpperCase();
  let inserted = 0;
  let skipped = 0;

  for (const kw of keywords.slice(0, 10)) {
    try {
      const url = `${YT_BASE}?q=${encodeURIComponent(kw.keyword)}&part=snippet&type=video&maxResults=10&regionCode=${region}&key=${apiKey}`;
      const res = await fetchWithRetry(url);
      if (!res.ok) continue;

      const data: YTApiResponse = await res.json();
      const items = data.items || [];

      const videoIds = items.map((i) => i.id.videoId).filter(Boolean);
      const viewMap = await fetchViewCounts(videoIds);

      for (const item of items) {
        const videoId = item.id.videoId;
        if (!videoId || !item.snippet?.title) continue;

        const exists = await prisma.youTubeVideo.findUnique({ where: { videoId } });
        if (exists) { skipped++; continue; }

        const title = item.snippet.title;
        const description = item.snippet.description || "";
        const { primary, sub } = classifyArticle(title, description);

        await prisma.youTubeVideo.create({
          data: {
            videoId,
            sourceId,
            title,
            description,
            channelName: item.snippet.channelTitle || "",
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
            views: viewMap.get(videoId) || 0,
            category: sub || primary,
            language: lang,
            country: region.toLowerCase(),
            publishedAt: new Date(item.snippet.publishedAt),
          },
        });
        inserted++;
      }
    } catch (err) {
      console.error(`[YouTube] Error fetching keyword "${kw.keyword}":`, err);
    }
  }

  return { inserted, skipped };
}

export async function fetchYouTube(opts?: FetchOptions) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("[YouTube] No YOUTUBE_API_KEY set");
    return { inserted: 0, skipped: 0 };
  }

  const source = await prisma.source.findUnique({
    where: { name: "YouTube" },
    select: { id: true, name: true, status: true },
  });
  if (!source || source.status !== "active") {
    console.warn("[YouTube] Source not found or inactive");
    return { inserted: 0, skipped: 0 };
  }

  const keywords = await prisma.keyword.findMany({ where: { active: true } });
  if (keywords.length === 0) {
    console.warn("[YouTube] No active keywords");
    return { inserted: 0, skipped: 0 };
  }

  let totalInserted = 0;
  let totalSkipped = 0;

  if (opts?.lang && opts?.country) {
    const result = await fetchYouTubeForLocale(source.id, opts, keywords, apiKey);
    totalInserted += result.inserted;
    totalSkipped += result.skipped;
  } else {
    for (const locale of YT_LOCALES) {
      console.log(`[YouTube] Fetching for ${locale.lang}/${locale.country}...`);
      const result = await fetchYouTubeForLocale(source.id, locale, keywords, apiKey);
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
    }
  }

  console.log(`[YouTube] Done: ${totalInserted} inserted, ${totalSkipped} skipped`);
  return { inserted: totalInserted, skipped: totalSkipped };
}
