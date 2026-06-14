import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const keyword = searchParams.get("keyword") || undefined;
  const source = searchParams.get("source") || undefined;
  const lang = searchParams.get("lang") || undefined;
  const country = searchParams.get("country") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: any = {};
  if (category && category !== "all") where.category = category;
  if (keyword) where.title = { contains: keyword, mode: "insensitive" };
  if (source && source !== "all") where.sourceId = source;
  if (lang && lang !== "all") where.language = lang;
  if (country && country !== "all") where.country = country;

  const [items, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy: { publishedAt: "desc" }, take: limit, skip: offset }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ items, total, limit, offset });
}
