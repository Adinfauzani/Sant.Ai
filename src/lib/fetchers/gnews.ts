import { prisma } from "@/lib/db";
import { classifyArticle, detectSentiment } from "@/lib/classifier";
import { scrapeOgImage } from "@/lib/ogImage";

const GNEWS_HEADLINES = "https://gnews.io/api/v4/top-headlines";
const GNEWS_SEARCH = "https://gnews.io/api/v4/search";

interface GNewsArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  image: string;
  source: { name: string };
  publishedAt: string;
}

interface FetchOptions {
  lang?: string;
  country?: string;
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (res.ok) return res;
    } catch {
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return fetch(url);
}

async function saveArticle(sourceId: string, item: GNewsArticle, language: string, country: string): Promise<boolean> {
  if (!item.title || !item.url) return false;
  const exists = await prisma.article.findUnique({ where: { url: item.url } });
  if (exists) return false;

  const { primary, sub } = classifyArticle(item.title, item.description || "");
  const sentiment = detectSentiment(`${item.title} ${item.description || ""}`);
  const image = item.image || (await scrapeOgImage(item.url));

  await prisma.article.create({
    data: {
      sourceId,
      title: item.title,
      description: item.description || "",
      content: item.content || "",
      url: item.url,
      image,
      category: sub || primary,
      sentiment,
      language,
      country,
      publishedAt: new Date(item.publishedAt),
    },
  });
  return true;
}

const LOCALES: FetchOptions[] = [
  { lang: "id", country: "id" },
  { lang: "en", country: "us" },
];

async function fetchForLocale(sourceId: string, locale: FetchOptions, keywords: { keyword: string }[], apiKey: string): Promise<{ inserted: number; skipped: number }> {
  const lang = locale.lang!;
  const country = locale.country!;
  let inserted = 0;
  let skipped = 0;

  // ── 1. Top headlines ──
  console.log(`[GNews] Fetching top-headlines (lang=${lang}, country=${country})...`);
  const headlinesUrl = `${GNEWS_HEADLINES}?category=general&lang=${lang}&country=${country}&max=10&apikey=${apiKey}`;
  const headlinesRes = await fetchWithRetry(headlinesUrl);
  if (headlinesRes.ok) {
    const data = await headlinesRes.json();
    for (const item of (data.articles || []) as GNewsArticle[]) {
      const saved = await saveArticle(sourceId, item, lang, country);
      if (saved) inserted++; else skipped++;
    }
    console.log(`  Headlines: ${(data.articles || []).length} articles`);
  } else {
    console.warn(`  Headlines failed: ${headlinesRes.status}`);
  }

  // ── 2. Search by keyword ──
  for (const kw of keywords) {
    try {
      const url = `${GNEWS_SEARCH}?q=${encodeURIComponent(kw.keyword)}&lang=${lang}&country=${country}&max=10&apikey=${apiKey}`;
      const res = await fetchWithRetry(url);
      if (!res.ok) continue;

      const data = await res.json();
      for (const item of (data.articles || []) as GNewsArticle[]) {
        const saved = await saveArticle(sourceId, item, lang, country);
        if (saved) inserted++; else skipped++;
      }
    } catch (err) {
      console.error(`[GNews] Error fetching "${kw.keyword}":`, err);
    }
  }

  return { inserted, skipped };
}

export async function fetchGNews(opts?: FetchOptions) {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn("[GNews] No GNEWS_API_KEY set");
    return { inserted: 0, skipped: 0 };
  }

  const source = await prisma.source.findUnique({
    where: { name: "GNews" },
    select: { id: true, name: true, status: true },
  });
  if (!source || source.status !== "active") {
    console.warn("[GNews] Source not found or inactive");
    return { inserted: 0, skipped: 0 };
  }

  const keywords = await prisma.keyword.findMany({ where: { active: true } });
  console.log(`[GNews] ${keywords.length} keywords across ${LOCALES.length} locales...`);

  let totalInserted = 0;
  let totalSkipped = 0;

  if (opts?.lang && opts?.country) {
    const result = await fetchForLocale(source.id, { lang: opts.lang, country: opts.country }, keywords, apiKey);
    totalInserted += result.inserted;
    totalSkipped += result.skipped;
  } else {
    for (const locale of LOCALES) {
      const result = await fetchForLocale(source.id, locale, keywords, apiKey);
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
    }
  }

  console.log(`[GNews] Done: ${totalInserted} inserted, ${totalSkipped} skipped`);
  return { inserted: totalInserted, skipped: totalSkipped };
}
