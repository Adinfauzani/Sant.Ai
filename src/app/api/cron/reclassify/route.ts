import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { classifyArticle } from "@/lib/classifier";

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  let changed = 0;
  for (const art of articles) {
    const { primary, sub } = classifyArticle(art.title, art.description);
    const newCategory = sub || primary;
    if (newCategory !== art.category) {
      await prisma.article.update({
        where: { id: art.id },
        data: { category: newCategory },
      });
      changed++;
    }
  }
  return NextResponse.json({ total: articles.length, changed });
}
