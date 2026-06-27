import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Heart, TrendingUp, Github, ExternalLink, Users, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { showcaseProjects, type ShowcaseDetail } from "@/data/showcaseProjects";

export function generateStaticParams() {
  return showcaseProjects.map((p) => ({ slug: p.slug }));
}

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400",
  TI: "bg-emerald-500/15 text-emerald-400",
  SI: "bg-purple-500/15 text-purple-400",
};

function TeamMemberCard({ member }: { member: ShowcaseDetail["teamMembers"][number] }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3 backdrop-blur-sm transition-all hover:border-primary/20">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
        {member.name.split(" ").map((n) => n[0]).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">{member.name}</p>
        <p className="text-[10px] text-muted">{member.role}</p>
      </div>
      <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold ${programColors[member.program]}`}>
        {member.program}
      </span>
    </div>
  );
}

export default async function ShowcaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = slug ? showcaseProjects.find((p) => p.slug === slug) : undefined;
  if (!project) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className={`relative flex h-56 items-end bg-gradient-to-br ${project.cover} md:h-72`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-15`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="container-main relative z-10 pb-8">
            <div className="mx-auto max-w-4xl">
              <span className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] font-semibold backdrop-blur-sm ${
                project.status === "Completed" ? "bg-emerald-500/30 text-emerald-200" :
                project.status === "Active" ? "bg-blue-500/30 text-blue-200" :
                "bg-amber-500/30 text-amber-200"
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        <div className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/showcase"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Showcase
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold leading-tight text-text md:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-2 text-sm text-muted">{project.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href={project.githubUrl} target="_blank"><Github className="h-4 w-4" />Source</Link>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button size="sm" className="gap-2" asChild>
                    <Link href={project.demoUrl} target="_blank"><ExternalLink className="h-4 w-4" />Live Demo</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Eye, text: `${project.views} views` },
                { icon: Heart, text: `${project.likes} likes` },
                { icon: TrendingUp, text: `${project.impact} impact score` },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-[10px] text-muted backdrop-blur-sm">
                  <m.icon className="h-3.5 w-3.5 text-primary" />
                  {m.text}
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Program Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.programs.map((p) => (
                <span key={p} className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold ${programColors[p]}`}>
                  {p}
                </span>
              ))}
            </div>

            {/* Content Grid */}
            <div className="mt-10 grid gap-8 md:grid-cols-5">
              <div className="space-y-8 md:col-span-3">
                {/* Problem Statement */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-text">Problem Statement</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.problemStatement}</p>
                </div>

                {/* Solution */}
                <div>
                  <h2 className="font-heading text-xl font-bold text-text">Solution</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.solution}</p>
                </div>

                {/* Impact */}
                <div className="rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-sm">
                  <h2 className="font-heading text-lg font-bold text-text">Impact Summary</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{project.impactSummary}</p>
                </div>
              </div>

              <div className="space-y-6 md:col-span-2">
                {/* Team */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-text">Team Members</h3>
                  <div className="mt-3 space-y-2.5">
                    {project.teamMembers.map((m, i) => (
                      <TeamMemberCard key={i} member={m} />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button className="gap-2"><Heart className="h-4 w-4" /> Like This Project</Button>
                  <Button variant="outline" className="gap-2"><Users className="h-4 w-4" /> Join Team</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
