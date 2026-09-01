import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import PeopleBrowser from "./_peopleBrowser";

export const dynamic = "force-dynamic";

export interface PeopleItem {
  id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string;
  studyProgram: string | null;
  semester: number | null;
  university: string;
  skills: string[];
  level: string;
  reputationPoints: number;
}

export default async function PeoplePage() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) redirect("/login");

  const users = await prisma.user.findMany({
    where: { banned: false },
    orderBy: [{ reputationPoints: "desc" }, { name: "asc" }],
    take: 120,
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      studyProgram: true,
      semester: true,
      university: true,
      skills: true,
      level: true,
      reputationPoints: true,
    },
  });

  const items: PeopleItem[] = users.map((u) => {
    let skills: string[] = [];
    try {
      const parsed = JSON.parse(u.skills);
      if (Array.isArray(parsed)) skills = parsed.map((s) => String(s)).slice(0, 5);
    } catch { /* ignore */ }
    return { ...u, skills };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main section-padding">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Kolaborasi</p>
                <h1 className="mt-2 font-heading text-3xl font-bold text-text">Temukan Kolaborator</h1>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Jelajahi mahasiswa dan peneliti di ekosistem Sant.Ai berdasarkan program studi, keahlian, dan tingkat reputasi.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-text">{items.length}</span>
                <span className="text-[11px] text-muted">anggota aktif</span>
              </div>
            </div>

            <PeopleBrowser items={items} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}