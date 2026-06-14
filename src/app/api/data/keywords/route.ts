import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.keyword.findMany({ orderBy: { keyword: "asc" } });
  return NextResponse.json({ items });
}
