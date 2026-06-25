import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Calendar, Link2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { JoinProjectButton, CompleteProjectButton, ProjectCommentForm, ProjectComments } from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  Open: "text-emerald-500 border-emerald-500/30",
  "In Progress": "text-amber-500 border-amber-500/30",
  Completed: "text-blue-500 border-blue-500/30",
};

const programColors: Record<string, string> = {
  SD: "bg-blue-500/10 text-blue-500",
  TI: "bg-emerald-500/10 text-emerald-500",
  SI: "bg-purple-500/10 text-purple-500",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getAuthSession(await headers());

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true, studyProgram: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true, studyProgram: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
      projectRoles: true,
      comments: {
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      contributions: {
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true } },
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
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {project.createdAt.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold text-text">
                {project.title}
              </h1>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Description
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text">
                    {project.description}
                  </p>
                </div>

                {project.problemStatement && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Problem Statement
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text">
                      {project.problemStatement}
                    </p>
                  </div>
                )}

                {project.techStack && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Tech Stack
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {project.techStack.split(",").map((t) => (
                        <span
                          key={t.trim()}
                          className="rounded-md bg-primary/5 px-2.5 py-1 text-xs text-primary"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.resultSummary && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Result
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text">
                      {project.resultSummary}
                    </p>
                  </div>
                )}

                {project.impactSummary && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Impact
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text">
                      {project.impactSummary}
                    </p>
                  </div>
                )}

                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Link2 className="h-4 w-4" />
                    View Demo / Repository
                  </a>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Comments ({project.comments.length})
                </h3>
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
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {project.creator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{project.creator.name}</p>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${programColors[project.creator.studyProgram]}`}>
                      {project.creator.studyProgram}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-text">Team Members</h4>
                  <div className="mt-2 space-y-2">
                    {project.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {member.user.name.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/${member.user.username || member.user.id}`}
                            className="text-xs text-text hover:text-primary"
                          >
                            {member.user.name}
                          </Link>
                          <span className={`ml-2 rounded px-1 py-0.5 text-[9px] ${programColors[member.user.studyProgram]}`}>
                            {member.user.studyProgram}
                          </span>
                          <p className="text-[10px] text-muted">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-text">Required Roles</h4>
                  <div className="mt-2 space-y-1.5">
                    {project.projectRoles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                      >
                        <span className="text-xs font-medium text-text">{role.studyProgram}</span>
                        <span className="text-[10px] text-muted">
                          {role.filled}/{role.required}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {canJoin && (
                <JoinProjectButton projectId={project.id} />
              )}

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
