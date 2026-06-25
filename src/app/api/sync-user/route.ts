import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession(req.headers);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { name, email, username, studyProgram, semester } = await req.json();

    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          id: session.user.id,
          name: name || session.user.name || "",
          username: username || session.user.username,
          email: email || session.user.email,
          password: "",
          studyProgram: studyProgram || "TI",
          semester: semester || 1,
          avatar: session.user.image || "",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("sync-user error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
