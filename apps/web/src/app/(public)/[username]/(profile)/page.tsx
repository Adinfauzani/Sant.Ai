import { notFound } from "next/navigation";
import { GitBranch, Award, Users, Activity, FolderOpen, FileText } from "lucide-react";
import ProfileSidebar from "@/components/profile/profileSidebar";
import ProfileReadme from "@/components/profile/profileReadme";
import ActivityTimeline from "@/components/profile/activityTimeline";
import ContributionGraph from "@/components/profile/contributionGraph";
import StreakCounter from "@/components/profile/streakCounter";
import PinnedProjects from "@/components/profile/pinnedProjects";
import ProfileProjectCard from "@/components/profile/profileProjectCard";
import ProjectCard from "@/components/profile/projectCard";
import ProfileTabs from "@/components/profile/profileTabs";
import { PROFILE_TABS, type ProfileTabKey } from "@/lib/profile/profileTabs";
import { getAvatarUrl } from "@/lib/profile/gravatar";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";
import { headers } from "next/headers";
import { getAuthSession } from "@/lib/auth/auth";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params;
  const { tab } = await searchParams;
  if (isReservedUsername(username)) notFound();

  const validTabs = PROFILE_TABS.map((t) => t.key as string);
  const defaultTab: ProfileTabKey = (validTabs.includes(tab as string) ? tab : "overview") as ProfileTabKey;

  const user = await prisma.user.findFirst({
    where: { username },
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
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          techStack: true,
          demoLink: true,
        },
      },
      contributions: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          type: true,
          description: true,
          points: true,
          createdAt: true,
        },
      },
      teamMembers: {
        orderBy: { joinedAt: "desc" },
        take: 50,
        select: {
          id: true,
          role: true,
          joinedAt: true,
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              techStack: true,
              demoLink: true,
            },
          },
        },
      },
    },
  });

  if (!user) notFound();

  const session = await getAuthSession(await headers());
  const isOwner = session?.user?.id === user.id;

  // ---------- Pinned ----------
  let pinnedIds: string[] = [];
  try {
    pinnedIds = JSON.parse(user.pinnedProjects || "[]");
  } catch { /* ignore */ }

  let pinnedProjectData: any[] = [];
  if (pinnedIds.length > 0) {
    pinnedProjectData = await prisma.project.findMany({
      where: { id: { in: pinnedIds } },
      select: { id: true, title: true, description: true, status: true, techStack: true, demoLink: true },
    });
  }

  // ---------- Overview derived ----------
  const totalProjects = user._count.ownedProjects + user._count.teamMembers;
  const activityItems = [
    ...user.contributions.slice(0, 5).map((c) => ({
      id: c.id,
      icon: <Activity className="h-3 w-3" />,
      description: c.description,
      date: fmtDate(c.createdAt),
      points: c.points,
      type: c.type,
    })),
    ...user.teamMembers.slice(0, 5).map((tm) => ({
      id: tm.id,
      icon: <Users className="h-3 w-3" />,
      description: `Bergabung ke proyek "${tm.project.title}" sebagai ${tm.role}`,
      date: fmtDate(tm.joinedAt),
      points: undefined as number | undefined,
      type: "join" as string | undefined,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const overviewBadges = [
    { earned: true, label: "Anggota", desc: "Bergabung ke komunitas Sant.AI", icon: <Users className="h-4 w-4" /> },
    { earned: user._count.ownedProjects >= 1, label: "Pembuat Proyek", desc: "Buat proyek pertama kamu di platform", icon: <GitBranch className="h-4 w-4" /> },
    { earned: totalProjects >= 3, label: "Kolaborator", desc: "Bergabung atau membuat 3+ proyek", icon: <Award className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 50, label: "Kontributor Aktif", desc: "Dapat 50+ poin reputasi dari kontribusi", icon: <Activity className="h-4 w-4" /> },
    { earned: user.level === "Expert", label: "Expert", desc: "Mencapai level Expert", icon: <Award className="h-4 w-4" /> },
  ].filter((b) => b.earned).slice(0, 5);

  const allTech = new Set<string>();
  user.ownedProjects.forEach((p) => {
    try {
      const stack = typeof p.techStack === "string" ? JSON.parse(p.techStack) : p.techStack;
      if (Array.isArray(stack)) stack.forEach((t: string) => allTech.add(t));
    } catch { /* ignore */ }
  });
  const techStack = Array.from(allTech).slice(0, 12);

  // ---------- Projects panel ----------
  const joinedProjects = user.teamMembers.map((tm) => tm.project);
  const allProjects = [...user.ownedProjects, ...joinedProjects];
  const seen = new Set<string>();
  const uniqueProjects = allProjects.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const sidebarStats = { followers: 0, following: 0 };
  const avatarImage = user.image ?? getAvatarUrl(user.email);

  return (
    <ProfileTabs
      username={username}
      defaultTab={defaultTab}
      sidebar={(
        <aside className="w-full shrink-0 lg:w-72">
          <div className="lg:sticky lg:top-24">
            <ProfileSidebar
              user={{
                name: user.name,
                username: user.username,
                image: avatarImage,
                bio: user.bio,
                location: user.location || "",
                website: user.website || "",
                reputationPoints: user.reputationPoints,
                level: user.level,
                createdAt: user.createdAt,
                studyProgram: user.studyProgram || "",
                semester: user.semester ?? 0,
              }}
              stats={sidebarStats}
              badges={overviewBadges}
              techStack={techStack}
              isOwner={isOwner}
            />
          </div>
        </aside>
      )}
    >
      {/* Overview */}
      <div className="space-y-8">
        <ContributionGraph contributions={user.contributions.map((c) => ({ createdAt: c.createdAt }))} />
        <StreakCounter contributions={user.contributions.map((c) => ({ createdAt: c.createdAt }))} />

        {pinnedProjectData.length > 0 && (
          <PinnedProjects projects={pinnedProjectData} />
        )}

        <ProfileReadme
          readme={user.readme}
          readmeType={user.readmeType as "text" | "markdown"}
          isOwner={isOwner}
        />

        {activityItems.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-base font-bold text-text">Aktivitas Terakhir</h2>
            <div className="rounded-xl border border-border bg-surface/30 p-5">
              <ActivityTimeline activities={activityItems} />
            </div>
          </section>
        )}

        {user.ownedProjects.length > 0 && (
          <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-base font-bold text-text">Proyek Unggulan</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.ownedProjects.slice(0, 3).map((p) => (
                    <ProjectCard key={p.id} {...p} />
                  ))}
                </div>
              </section>
            )}

            {activityItems.length === 0 && user.ownedProjects.length === 0 && (
              <div className="rounded-xl border border-border bg-surface/30 p-12 text-center">
                <p className="text-sm text-muted">Profil ini belum ada aktivitas.</p>
              </div>
            )}
          </div>

          {/* Projects */}
          <div>
            {uniqueProjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {uniqueProjects.map((p) => (
                  <ProfileProjectCard
                    key={p.id}
                    project={p}
                    isPinned={pinnedIds.includes(p.id)}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
                <FolderOpen className="mx-auto h-6 w-6 text-muted" />
                <p className="mt-2 text-sm text-muted">Belum ada proyek.</p>
              </div>
            )}
          </div>

          {/* Articles */}
          <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted" />
            <p className="mt-2 text-sm text-muted">
              Belum ada artikel. Artikel yang dipublikasikan pengguna akan muncul di sini.
            </p>
          </div>
    </ProfileTabs>
  );
}
