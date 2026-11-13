import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FolderKanban, Users, Calendar, Activity, ArrowRight,
  Plus, Trophy, Rocket, GitBranch, Star, Check, CircleDashed, PenLine, Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { profileCompleteness } from "@/lib/profile/profileCompleteness";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Badge } from "@santai/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_PROGRESS: Record<string, number> = {
  Open: 40,
  "In Progress": 65,
  Review: 85,
  Completed: 100,
};

const STATUS_VARIANT: Record<string, "success" | "default" | "warning" | "secondary"> = {
  Open: "success",
  "In Progress": "default",
  Review: "warning",
  Completed: "secondary",
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={STATUS_VARIANT[status] ?? "default"}
      className="font-mono text-[9px]"
    >
      {status}
    </Badge>
  );
}

export default async function HubPage() {
  const session = await getAuthSession(await headers());
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedProjects: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, description: true, status: true },
      },
      teamMembers: {
        orderBy: { joinedAt: "desc" },
        take: 5,
        select: {
          id: true,
          project: { select: { id: true, title: true, description: true, status: true } },
        },
      },
      communityMembers: {
        include: {
          community: {
            select: {
              id: true,
              slug: true,
              name: true,
              description: true,
              _count: { select: { members: true, posts: true } },
            },
          },
        },
      },
      eventRegistrations: {
        where: { event: { startAt: { gte: new Date() } } },
        orderBy: { createdAt: "desc" },
        include: {
          event: { select: { id: true, slug: true, title: true, startAt: true, location: true, status: true } },
        },
      },
      contributions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, type: true, description: true, points: true, createdAt: true },
      },
      communityPosts: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          content: true,
          createdAt: true,
          community: { select: { slug: true, name: true } },
        },
      },
    },
  });

  // Dedupe projects: owned first, then joined
  const seen = new Set<string>();
  const projects = [
    ...user!.ownedProjects.map((p) => ({ id: p.id, title: p.title, description: p.description, status: p.status, mine: true })),
    ...user!.teamMembers.map((tm) => ({ ...tm.project, mine: false })),
  ].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const activity = [
    ...user!.contributions.map((c) => ({
      id: `c-${c.id}`,
      type: c.type,
      description: c.description,
      time: c.createdAt,
      href: "",
    })),
    ...user!.communityPosts.map((p) => ({
      id: `p-${p.id}`,
      type: "post",
      description: `Post di ${p.community.name}`,
      time: p.createdAt,
      href: `/community/${p.community.slug}`,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 8);

  const { score: profileScore, items: profileItems } = profileCompleteness({
    image: user!.image,
    bio: user!.bio,
    studyProgram: user!.studyProgram,
    semester: user!.semester,
    university: user!.university,
    faculty: user!.faculty,
    skills: user!.skills,
    interests: user!.interests,
    socialLinks: user!.socialLinks,
    readme: user!.readme,
    location: user!.location,
    website: user!.website,
  });

  const hasProject = projects.length > 0;
  const hasCommunity = user!.communityMembers.length > 0;
  const hasEvent = user!.eventRegistrations.length > 0;
  const onboardingSteps = [
    { done: profileScore === 100, label: "Lengkapi profilmu", href: `/${user!.username}/settings`, icon: <PenLine className="h-3.5 w-3.5" /> },
    { done: hasProject, label: "Buat atau gabung proyek", href: "/projects/create", icon: <Rocket className="h-3.5 w-3.5" /> },
    { done: hasCommunity, label: "Gabung komunitas", href: "/community", icon: <Users className="h-3.5 w-3.5" /> },
    { done: hasEvent, label: "Daftar event kampus", href: "/events", icon: <Calendar className="h-3.5 w-3.5" /> },
  ];
  const showOnboarding = onboardingSteps.some((s) => !s.done);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main section-padding">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                  {initials(user!.name)}
                </div>
                <div>
                  <p className="text-xs text-muted">{greeting()},</p>
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-text">{user!.name}</h1>
                  <p className="mt-0.5 text-xs text-muted">
                    <span className="text-primary">@{user!.username}</span>
                    {user!.bio && <span className="ml-2 text-muted">· {user!.bio}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2.5">
                  <Trophy className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-sm font-bold text-text">{user!.reputationPoints}</p>
                    <p className="text-[9px] text-muted">reputasi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-4 py-2.5">
                  <Star className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-text">{user!.level}</p>
                    <p className="text-[9px] text-muted">level</p>
                  </div>
                </div>
              </div>
            </div>

            {showOnboarding && (
              <div className="mt-6 flex flex-col gap-4 lg:flex-row">
                <section className="flex-1 rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h2 className="font-heading text-sm font-bold text-text">Langkah Pertama di Sant.Ai</h2>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {onboardingSteps.map((s) => (
                      <li key={s.label}>
                        <Link
                          href={s.href}
                          className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                            s.done ? "text-muted cursor-default" : "text-text hover:bg-surface"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              s.done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {s.done ? <Check className="h-3 w-3" /> : s.icon}
                          </span>
                          <span className={s.done ? "line-through decoration-border" : ""}>{s.label}</span>
                          {!s.done && (
                            <ArrowRight className="ml-auto h-3 w-3 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="flex-1 rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-sm font-bold text-text">Lengkapi Profilmu</h2>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {profileScore === 100 ? "Profil kamu sudah lengkap. Mantap!" : "Informasi lengkap membantu kolaborator menemukanmu."}
                      </p>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-primary">{profileScore}%</span>
                  </div>
                  {profileScore < 100 && (
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${profileScore}%` }}
                      />
                    </div>
                  )}
                  <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {profileItems.map((item) => (
                      <li key={item.label}>
                        {item.done ? (
                          <span className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] text-muted">
                            <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            href={`/${user!.username}/settings`}
                            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] text-text transition-colors hover:bg-surface"
                          >
                            <CircleDashed className="h-3.5 w-3.5 shrink-0 text-muted" />
                            {item.label}
                            <ArrowRight className="ml-auto h-3 w-3 text-muted" />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/projects/create" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">Buat Proyek</p>
                  <p className="text-[10px] text-muted">Mulai kolaborasi baru</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/showcase" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">Jelajahi Proyek</p>
                  <p className="text-[10px] text-muted">Temukan kolaborasi</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/community" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">Komunitas</p>
                  <p className="text-[10px] text-muted">Gabung &amp; berdiskusi</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/people" className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">Cari Rekan</p>
                  <p className="text-[10px] text-muted">Temukan kolaborator</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-5">
              <div className="space-y-8 lg:col-span-3">
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold tracking-tight text-text">Proyek Saya</h2>
                    <Link href="/showcase" className="text-[11px] text-muted hover:text-primary transition-colors">Lihat semua</Link>
                  </div>
                  {projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
                      <Rocket className="mx-auto h-6 w-6 text-primary" />
                      <p className="mt-2 text-sm font-semibold text-text">Belum ada proyek</p>
                      <p className="mt-1 text-xs text-muted">Buat proyek pertamamu atau gabung proyek di showcase.</p>
                      <Link href="/projects/create" className="mt-3 inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20">
                        <Plus className="h-3 w-3" /> Buat Proyek
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((p) => (
                        <Link key={p.id} href={`/projects/${p.id}`} className="group block rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-text group-hover:text-primary">{p.title}</p>
                            <div className="flex shrink-0 items-center gap-2">
                              <StatusBadge status={p.status} />
                              {p.mine && <GitBranch className="h-3.5 w-3.5 text-primary" />}
                            </div>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{p.description}</p>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${STATUS_PROGRESS[p.status] ?? 40}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold tracking-tight text-text">Aktivitas Terbaru</h2>
                  </div>
                  {activity.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-xs text-muted">
                      Belum ada aktivitas. Mulai dengan membuat proyek atau posting di komunitas.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activity.map((a) => (
                        <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors duration-150 hover:border-border-strong">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.type === "post" ? "bg-primary/10" : "bg-primary/10"}`}>
                            {a.type === "post" ? <Users className="h-4 w-4 text-primary" /> : <Activity className="h-4 w-4 text-primary" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-text">{a.description}</p>
                            <p className="text-[10px] text-muted">
                              {a.time.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          {a.href && (
                            <Link href={a.href} className="text-[10px] text-primary hover:text-primary/80">
                              Buka
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className="space-y-8 lg:col-span-2">
                <section>
                  <h2 className="mb-4 font-heading text-lg font-bold tracking-tight text-text">Komunitas Saya</h2>
                  {user!.communityMembers.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted">
                      Belum bergabung ke komunitas mana pun.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {user!.communityMembers.map((m) => (
                        <Link key={m.community.id} href={`/community/${m.community.slug}`} className="group block rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                          <p className="text-sm font-semibold text-text group-hover:text-primary">{m.community.name}</p>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{m.community.description}</p>
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{m.community._count.members}</span>
                            <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{m.community._count.posts} posts</span>
                            <span className="ml-auto rounded-md bg-primary/5 px-1.5 py-0.5 font-mono text-[9px] text-primary">{m.role}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="mb-4 font-heading text-lg font-bold tracking-tight text-text">Event Mendatang</h2>
                  {user!.eventRegistrations.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-xs text-muted">
                      Belum terdaftar di event apa pun.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {user!.eventRegistrations.slice(0, 4).map((r) => (
                        <Link key={r.id} href={`/events/${r.event.slug}`} className="group block rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-border-strong">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-text group-hover:text-primary">{r.event.title}</p>
                            <StatusBadge status={r.event.status} />
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-primary" />
                              {r.event.startAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            {r.event.location && <span className="truncate">{r.event.location}</span>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link href="/events" className="mt-3 flex items-center justify-center gap-1 rounded-md bg-primary/10 py-2 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20">
                    Jelajahi Event <ArrowRight className="h-3 w-3" />
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}