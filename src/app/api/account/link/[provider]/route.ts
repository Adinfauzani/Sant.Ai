import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { provider } = await params;
  if (provider !== "github" && provider !== "google") {
    return NextResponse.json({ error: "invalid provider" }, { status: 400 });
  }

  const existing = await prisma.account.findFirst({
    where: { userId: session.user.id, provider },
  });
  if (existing) {
    return NextResponse.json({ error: "already linked" }, { status: 409 });
  }

  const cookieStore = await cookies();
  cookieStore.set("santet_link", JSON.stringify({ userId: session.user.id, provider }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  return NextResponse.json({ ok: true, provider });
}
