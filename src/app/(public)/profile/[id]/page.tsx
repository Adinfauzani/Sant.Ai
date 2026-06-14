import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Award, Users, Lightbulb, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

const programColors: Record<string, string> = {
  SD: "bg-blue-500/10 text-blue-500",
  TI: "bg-emerald-500/10 text-emerald-500",
  SI: "bg-purple-500/10 text-purple-500",
};

const levelColors: Record<string, string> = {
  Beginner: "text-muted border-border",
  Active: "text-emerald-500 border-emerald-500/30",
  Lead: "text-amber-500 border-amber-500/30",
  Expert: "text-purple-500 border-purple-500/30",
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          ownedProjects: true,
          teamMembers: true,
          ideas: true,
          contributions: true,
        },
      },
      ownedProjects: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      teamMembers: {
        include: {
          project: true,
        },
        orderBy: { joinedAt: "desc" },
        take: 5,
      },
      contributions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div>
              <div className="rounded-xl border border-border bg-surface p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {user.name.charAt(0)}
                </div>
                <h1 className="mt-4 font-heading text-xl font-bold text-text">{user.name}</h1>
                <span className={`inline-block rounded-full border px-3 py-0.5 text-xs ${programColors[user.studyProgram]}`}>
                  {user.studyProgram}
                </span>
                <p className="mt-2 text-xs text-muted">Semester {user.semester}</p>

                {user.bio && (
                  <p className="mt-3 text-xs leading-relaxed text-muted">{user.bio}</p>
                )}

                <div className="mt-6 flex items-center justify-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm text-text">{user.reputationPoints} pts</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${levelColors[user.level]}`}>
                    {user.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="font-heading text-lg font-bold text-text">{user._count.ownedProjects}</p>
                  <p className="text-[10px] text-muted">Projects Created</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="font-heading text-lg font-bold text-text">{user._count.teamMembers}</p>
                  <p className="text-[10px] text-muted">Projects Joined</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="font-heading text-lg font-bold text-text">{user._count.ideas}</p>
                  <p className="text-[10px] text-muted">Ideas Posted</p>
                </div>
              </div>

              {user.ownedProjects.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Owned Projects
                  </h3>
                  <div className="mt-3 space-y-2">
                    {user.ownedProjects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text">{p.title}</span>
                          <span className="text-[10px] text-muted">{p.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {user.teamMembers.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Joined Projects
                  </h3>
                  <div className="mt-3 space-y-2">
                    {user.teamMembers.map((tm) => (
                      <Link
                        key={tm.id}
                        href={`/projects/${tm.projectId}`}
                        className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text">{tm.project.title}</span>
                          <span className="text-[10px] text-muted">{tm.role}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {user.contributions.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Recent Contributions
                  </h3>
                  <div className="mt-3 space-y-2">
                    {user.contributions.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface p-3"
                      >
                        <div>
                          <p className="text-xs text-text">{c.description}</p>
                          <p className="text-[10px] text-muted">
                            {c.createdAt.toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-500">+{c.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
