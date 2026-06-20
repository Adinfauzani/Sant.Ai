import { NextResponse } from "next/server";
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

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider },
  });
  if (!account) {
    return NextResponse.json({ error: "not linked" }, { status: 404 });
  }

  const totalAccounts = await prisma.account.count({
    where: { userId: session.user.id },
  });

  const hasPassword = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (totalAccounts <= 1 && (!hasPassword?.password || hasPassword.password === "")) {
    return NextResponse.json(
      { error: "Cannot unlink your only sign-in method. Set a password first." },
      { status: 400 },
    );
  }

  await prisma.account.delete({ where: { id: account.id } });

  return NextResponse.json({ ok: true });
}
