import { NextResponse } from "next/server";
import { backfillArticleImages } from "@/lib/ogImage";

export async function GET() {
  const result = await backfillArticleImages(20);
  return NextResponse.json(result);
}
