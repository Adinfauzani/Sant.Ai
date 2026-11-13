import { prisma } from "@/lib/db";

export async function scrapeOgImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SantAiBot/1.0)" },
    });
    if (!res.ok) return "";
    const html = await res.text();
    const m = html.match(
      /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i
    );
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

export async function backfillArticleImages(batch = 20) {
  const articles = await prisma.article.findMany({
    where: { image: "" },
    take: batch,
  });
  let updated = 0;
  for (const art of articles) {
    const img = await scrapeOgImage(art.url);
    if (img) {
      await prisma.article.update({ where: { id: art.id }, data: { image: img } });
      updated++;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return { scanned: articles.length, updated };
}
