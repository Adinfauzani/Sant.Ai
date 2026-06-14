import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [totalArticles, totalVideos, activeSources, totalKeywords, categoryDist, recentArticles, recentVideos] =
    await Promise.all([
      prisma.article.count(),
      prisma.youTubeVideo.count(),
      prisma.source.count({ where: { status: "active" } }),
      prisma.keyword.count({ where: { active: true } }),
      prisma.article.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } }),
      prisma.article.findMany({ orderBy: { publishedAt: "desc" }, take: 10 }),
      prisma.youTubeVideo.findMany({ orderBy: { publishedAt: "desc" }, take: 10 }),
    ]);

  return NextResponse.json({
    totalArticles,
    totalVideos,
    activeSources,
    totalKeywords,
    categories: categoryDist.map((c) => ({ name: c.category, count: c._count })),
    recentArticles: recentArticles.map((a) => ({
      id: a.id, title: a.title, source: a.sourceId, category: a.category,
      date: a.publishedAt.toISOString().split("T")[0],
    })),
    recentVideos: recentVideos.map((v) => ({
      id: v.id, title: v.title, channel: v.channelName, category: v.category,
      views: v.views, date: v.publishedAt.toISOString().split("T")[0],
    })),
  });
}
