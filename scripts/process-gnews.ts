import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

function classifyArticle(title: string, desc: string) {
  const text = `${title} ${desc}`.toLowerCase();
  const cats: Record<string, string[]> = {
    Pendidikan: ["education", "school", "university", "student", "learning", "teacher", "curriculum", "exam"],
    Teknologi: ["technology", "digital", "tech", "software", "startup", "app", "internet", "ai", "data", "computer", "robot", "cyber"],
    Ekonomi: ["economy", "finance", "bank", "market", "trade", "business", "inflation", "stock", "investment", "fintech"],
    Kesehatan: ["health", "medical", "hospital", "doctor", "vaccine", "disease", "mental", "covid", "patient"],
    Sosial: ["social", "community", "society", "poverty", "inequality", "media", "cultural", "humanitarian"],
    Lingkungan: ["environment", "climate", "pollution", "energy", "green", "sustainability", "carbon", "renewable", "emission"],
    Politik: ["politics", "government", "election", "policy", "president", "law", "parliament", "democracy", "military"],
  };
  for (const [cat, kws] of Object.entries(cats)) {
    if (kws.some((k) => text.includes(k))) return { primary: "Isu Publik Indonesia", sub: cat };
  }
  return { primary: "Isu Publik Indonesia", sub: "Teknologi" };
}

function detectSentiment(text: string): string {
  const lower = text.toLowerCase();
  const pos = ["good", "great", "success", "improve", "breakthrough", "positive", "launch", "win", "growth", "innovative"];
  const neg = ["bad", "fail", "crisis", "threat", "attack", "breach", "danger", "illegal", "crash", "death", "war", "corruption"];
  const pScore = pos.filter((w) => lower.includes(w)).length;
  const nScore = neg.filter((w) => lower.includes(w)).length;
  if (pScore > nScore) return "positive";
  if (nScore > pScore) return "negative";
  return "neutral";
}

async function main(filePath: string) {
  const data = await import(filePath) as any;
  const articles: any[] = data.default?.articles || data.articles || [];
  console.log(`Processing ${articles.length} articles from ${filePath}`);

  const source = await prisma.source.findUnique({ where: { name: "GNews" } });
  if (!source) { console.error("GNews source not found"); return; }

  let inserted = 0, skipped = 0;

  for (const item of articles) {
    if (!item.title || !item.url) continue;
    const exists = await prisma.article.findUnique({ where: { url: item.url } });
    if (exists) { skipped++; continue; }
    const { primary, sub } = classifyArticle(item.title, item.description || "");
    const sentiment = detectSentiment(`${item.title} ${item.description || ""}`);
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

  console.log(`Done: ${inserted} inserted, ${skipped} skipped`);
}

const filePath = process.argv[2];
if (!filePath) { console.error("Usage: tsx process-gnews.ts <json-file>"); process.exit(1); }
main(filePath).catch(console.error).finally(() => prisma.$disconnect());
