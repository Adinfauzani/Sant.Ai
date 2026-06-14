import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const lang = searchParams.get("lang") || undefined;
  const country = searchParams.get("country") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: any = {};
  if (category && category !== "all") where.category = category;
  if (lang) where.language = lang;
  if (country) where.country = country;

  const [items, total] = await Promise.all([
    prisma.youTubeVideo.findMany({ where, orderBy: { publishedAt: "desc" }, take: limit, skip: offset }),
    prisma.youTubeVideo.count({ where }),
  ]);

  return NextResponse.json({ items, total, limit, offset });
}
