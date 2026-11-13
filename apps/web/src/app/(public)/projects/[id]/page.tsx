import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Calendar, Link2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { JoinProjectButton, CompleteProjectButton, ProjectCommentForm, ProjectComments } from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

const statusVariant: Record<string, "success" | "warning" | "default"> = {
  Open: "success",
  "In Progress": "warning",
  Completed: "default",
};

const statusLabel: Record<string, string> = {
  Open: "Terbuka",
  "In Progress": "Berjalan",
  Completed: "Selesai",
};

const programVariant: Record<string, "default" | "secondary"> = {
  SD: "default",
  TI: "secondary",
  SI: "default",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getAuthSession(await headers());

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, image: true, studyProgram: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true, studyProgram: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
      projectRoles: true,
      comments: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      contributions: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!project) notFound();

  const isCreator = session?.user?.id === project.creatorId;
  const isMember = project.teamMembers.some((m) => m.user.id === session?.user?.id);
  const canJoin = !isCreator && !isMember && project.status !== "Completed" && !!session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Showcase
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant={statusVariant[project.status] ?? "default"}>
                  {statusLabel[project.status] ?? project.status}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Calendar className="size-3.5" />
                  {project.createdAt.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight text-text">{project.title}</h1>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="editorial-label">Deskripsi</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text">{project.description}</p>
                </div>

                {project.problemStatement && (
                  <div>
                    <p className="editorial-label">Masalah yang diselesaikan</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text">{project.problemStatement}</p>
                  </div>
                )}

                {project.techStack && (
                  <div>
                    <p className="editorial-label">Tech Stack</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.techStack.split(",").map((t) => (
                        <span
                          key={t.trim()}
                          className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.resultSummary && (
                  <div>
                    <p className="editorial-label">Hasil</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text">{project.resultSummary}</p>
                  </div>
                )}

                {project.impactSummary && (
                  <div>
                    <p className="editorial-label">Dampak</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text">{project.impactSummary}</p>
                  </div>
                )}

                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Link2 className="size-4" />
                    Lihat Demo / Repository
                    <ArrowRight className="size-3.5" />
                  </a>
                )}
              </div>

              <div className="mt-8">
                <p className="editorial-label">Komentar ({project.comments.length})</p>
                <div className="mt-3 space-y-3">
                  <ProjectComments comments={project.comments} />
                </div>
                {session?.user && (
                  <div className="mt-4">
                    <ProjectCommentForm projectId={project.id} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {project.creator.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{project.creator.name}</p>
                    <Badge variant={programVariant[project.creator.studyProgram || ""] ?? "secondary"} className="mt-1">
                      {project.creator.studyProgram}
                    </Badge>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-text">Anggota Tim</p>
                  <div className="mt-2 space-y-2">
                    {project.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-start gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-semibold text-primary">
                          {member.user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/${member.user.username || member.user.id}`}
                            className="text-xs text-text transition-colors hover:text-primary"
                          >
                            {member.user.name}
                          </Link>
                          <Badge
                            variant={programVariant[member.user.studyProgram || ""] ?? "secondary"}
                            className="ml-2"
                          >
                            {member.user.studyProgram}
                          </Badge>
                          <p className="mt-0.5 text-[10px] text-muted">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-text">Peran yang Dibutuhkan</p>
                  <div className="mt-2 space-y-1.5">
                    {project.projectRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2"
                      >
                        <span className="text-xs font-medium text-text">{role.studyProgram}</span>
                        <span className="font-mono text-[10px] text-muted">
                          {role.filled}/{role.required}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {canJoin && <JoinProjectButton projectId={project.id} />}

              {isCreator && project.status !== "Completed" && (
                <CompleteProjectButton projectId={project.id} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
