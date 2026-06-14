import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, FolderKanban, CheckCircle2, Tag, Calendar, Heart, Share2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { communities, type CommunityDetail } from "@/data/communities";

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }));
}

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400",
  TI: "bg-emerald-500/15 text-emerald-400",
  SI: "bg-purple-500/15 text-purple-400",
};

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white ${className ?? "h-8 w-8"}`}>
      {name}
    </div>
  );
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const community = slug ? communities.find((c) => c.slug === slug) : undefined;
  if (!community) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className={`relative flex h-56 items-end bg-gradient-to-br ${community.cover} md:h-72`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-15`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="container-main relative z-10 pb-8">
            <div className="mx-auto max-w-4xl">
              <span className="rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {community.category}
              </span>
            </div>
          </div>
        </div>

        <div className="container-main section-padding">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/community"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Community
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold leading-tight text-text md:text-4xl">
                  {community.name}
                </h1>
                <p className="mt-2 text-sm text-muted">{community.description}</p>
              </div>
              <Button className="shrink-0 gap-2">Join Community <Users className="h-4 w-4" /></Button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Users, text: `${community.memberCount} members` },
                { icon: MessageSquare, text: `${community.discussions} discussions` },
                { icon: FolderKanban, text: `${community.projectsCount} projects` },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-[10px] text-muted backdrop-blur-sm">
                  <m.icon className="h-3.5 w-3.5 text-primary" />
                  {m.text}
                </div>
              ))}
            </div>

            {/* Full Description */}
            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold text-text">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{community.fullDescription}</p>
            </div>

            {/* Topics */}
            <div className="mt-8">
              <h3 className="font-heading text-lg font-bold text-text">Topics</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {community.topics.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
                    <Tag className="h-3 w-3" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="mt-8">
              <h3 className="font-heading text-lg font-bold text-text">Community Rules</h3>
              <div className="mt-3 space-y-2">
                {community.rules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2.5 backdrop-blur-sm">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="text-[11px] text-muted">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Members & Discussions Grid */}
            <div className="mt-10 grid gap-8 md:grid-cols-5">
              {/* Members */}
              <div className="md:col-span-2">
                <h3 className="font-heading text-lg font-bold text-text">Members</h3>
                <div className="mt-3 space-y-2.5">
                  {community.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-2.5 backdrop-blur-sm transition-all hover:border-primary/20">
                      <Avatar name={m.avatar} className="h-8 w-8 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text truncate">{m.name}</p>
                        <p className="text-[9px] text-muted">{m.role}</p>
                      </div>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] font-semibold ${programColors[m.program]}`}>
                        {m.program}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Discussions */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-text">Recent Discussions</h3>
                  <Link href="#" className="text-[10px] font-medium text-primary transition-colors hover:text-primary/80">
                    View All
                  </Link>
                </div>
                <div className="mt-3 space-y-2.5">
                  {community.recentDiscussions.map((d, i) => (
                    <div key={i} className="rounded-xl border border-border bg-surface/50 px-4 py-3 backdrop-blur-sm transition-all hover:border-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{d.title}</p>
                          <div className="mt-1 flex items-center gap-3 text-[10px] text-muted">
                            <span>by {d.author}</span>
                            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{d.replies} replies</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{d.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
                        <button className="flex items-center gap-1 transition-colors hover:text-primary"><Heart className="h-3 w-3" />Like</button>
                        <button className="flex items-center gap-1 transition-colors hover:text-primary"><MessageSquare className="h-3 w-3" />Reply</button>
                        <button className="flex items-center gap-1 transition-colors hover:text-primary"><Share2 className="h-3 w-3" />Share</button>
                      </div>
                    </div>
                  ))}
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
