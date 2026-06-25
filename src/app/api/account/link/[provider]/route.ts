import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const session = await getAuthSession(_req.headers);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { provider } = await params;
  if (provider !== "github" && provider !== "google") {
    return NextResponse.json({ error: "invalid provider" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, provider });
}
