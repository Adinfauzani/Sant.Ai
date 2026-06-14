import { NextResponse } from "next/server";
import { backfillArticleImages } from "@/lib/og-image";

export async function GET() {
  const result = await backfillArticleImages(20);
  return NextResponse.json(result);
}
