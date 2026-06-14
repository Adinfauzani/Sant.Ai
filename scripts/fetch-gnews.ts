import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const GNEWS_BASE = "https://gnews.io/api/v4/search";

async function fetchWithRetry(url: string, retries = 5): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (res.ok) return res;
      console.log(`  attempt ${i + 1}: status ${res.status}`);
    } catch (e: any) {
      console.log(`  attempt ${i + 1} failed: ${e.message}${e.cause ? " (" + e.cause.code + ")" : ""}`);
    }
    if (i < retries - 1) await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

function classifyArticle(title: string, desc: string) {
  const text = `${title} ${desc}`.toLowerCase();
  if (/\b(ai|artificial intelligence|machine learning|digital literacy|hoax|misinformation|e-learning|edtech)\b/i.test(text))
    return { primary: "Literasi Digital", sub: "" };
  if (/\b(cyber security|malware|ransomware|phishing|data breach|hacking|encryption|cyber crime)\b/i.test(text))
    return { primary: "Keamanan Digital", sub: "" };
  const cats: Record<string, string[]> = {
    Pendidikan: ["education", "school", "university", "student", "learning", "teacher"],
    Teknologi: ["technology", "digital", "tech", "software", "startup", "app", "internet"],
    Ekonomi: ["economy", "finance", "bank", "market", "trade", "business", "inflation"],
    Kesehatan: ["health", "medical", "hospital", "doctor", "vaccine", "disease"],
    Sosial: ["social", "community", "society", "poverty", "inequality"],
    Lingkungan: ["environment", "climate", "pollution", "energy", "green", "sustainability"],
    Politik: ["politics", "government", "election", "policy", "president", "law"],
  };
  for (const [cat, kws] of Object.entries(cats)) {
    if (kws.some((k) => text.includes(k))) return { primary: "Isu Publik Indonesia", sub: cat };
  }
  return { primary: "Isu Publik Indonesia", sub: "Teknologi" };
}

async function seedGNews() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) { console.log("[GNews] No API key"); return { inserted: 0, skipped: 0 }; }

  const source = await prisma.source.findUnique({ where: { name: "GNews" } });
  if (!source) { console.log("[GNews] Source not found"); return { inserted: 0, skipped: 0 }; }

  const keywords = await prisma.keyword.findMany({ where: { active: true } });
  console.log(`[GNews] ${keywords.length} keywords, source ${source.id}`);

  let inserted = 0, skipped = 0;

  for (const kw of keywords.slice(0, 5)) {
    console.log(`\n[GNews] Fetching "${kw.keyword}"...`);
    const url = `${GNEWS_BASE}?q=${encodeURIComponent(kw.keyword)}&lang=en&max=10&apikey=${apiKey}`;
    const res = await fetchWithRetry(url);
    if (!res) { console.log(`  skipped after retries`); continue; }

    const data: any = await res.json();
    const articles: any[] = data.articles || [];
    console.log(`  got ${articles.length} articles`);

    for (const item of articles) {
      if (!item.title || !item.url) continue;
      const exists = await prisma.article.findUnique({ where: { url: item.url } });
      if (exists) { skipped++; continue; }

      const { primary, sub } = classifyArticle(item.title, item.description || "");
      const sentiment = /\b(good|great|success|improve|breakthrough|positive|launch)\b/i.test(`${item.title} ${item.description}`) ? "positive"
        : /\b(bad|fail|crisis|threat|attack|breach|danger|illegal)\b/i.test(`${item.title} ${item.description}`) ? "negative" : "neutral";

      await prisma.article.create({
        data: {
          sourceId: source.id,
          title: item.title,
          description: item.description || "",
          url: item.url,
          image: item.image || "",
          category: sub || primary,
          sentiment,
          publishedAt: new Date(item.publishedAt),
        },
      });
      inserted++;
    }
  }

  console.log(`\n[GNews] Done: ${inserted} inserted, ${skipped} skipped`);
  return { inserted, skipped };
}

seedGNews()
  .catch((e) => { console.error("Fatal:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
