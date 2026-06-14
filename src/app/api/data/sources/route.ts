import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.source.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
      rssUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ items });
}
