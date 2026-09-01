import { notFound } from "next/navigation";
import { GitBranch, Award, Users, Activity, FolderOpen, FileText, Star, Target } from "lucide-react";
import ProfileSidebar from "@/components/profile/profileSidebar";
import ProfileReadme from "@/components/profile/profileReadme";
import ActivityTimeline from "@/components/profile/activityTimeline";
import ContributionGraph from "@/components/profile/contributionGraph";
import StreakCounter from "@/components/profile/streakCounter";
import ActivityItem from "@/components/profile/activityItem";
import BadgeItem from "@/components/profile/badgeItem";
import PinnedProjects from "@/components/profile/pinnedProjects";
import ProfileProjectCard from "@/components/profile/profileProjectCard";
import ProjectCard from "@/components/profile/projectCard";
import ProfileTabs, { PROFILE_TABS, type ProfileTabKey } from "@/components/profile/profileTabs";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";
import { headers } from "next/headers";
import { getAuthSession } from "@/lib/auth";

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
      description: `Joined project "${tm.project.title}" as ${tm.role}`,
      date: fmtDate(tm.joinedAt),
      points: undefined as number | undefined,
      type: "join" as string | undefined,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const overviewBadges = [
    { earned: true, label: "Member", desc: "Joined the Sant.AI community", icon: <Users className="h-4 w-4" /> },
    { earned: user._count.ownedProjects >= 1, label: "Project Creator", desc: "Created your first project on the platform", icon: <GitBranch className="h-4 w-4" /> },
    { earned: totalProjects >= 3, label: "Collaborator", desc: "Joined or created 3+ projects", icon: <Award className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 50, label: "Active Contributor", desc: "Earned 50+ reputation points through contributions", icon: <Activity className="h-4 w-4" /> },
    { earned: user.level === "Expert", label: "Expert", desc: "Reached the Expert level", icon: <Award className="h-4 w-4" /> },
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

  // ---------- Activity panel ----------
  const activityItemsAll = [
    ...user.contributions.map((c) => ({
      id: `c-${c.id}`,
      date: c.createdAt,
      icon: <Activity className="h-3 w-3" />,
      description: c.description,
      points: c.points,
    })),
    ...user.teamMembers.map((tm) => ({
      id: `tm-${tm.id}`,
      date: tm.joinedAt,
      icon: <Users className="h-3 w-3" />,
      description: `Joined project "${tm.project.title}" as ${tm.role}`,
      points: undefined as number | undefined,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // ---------- Achievements panel ----------
  const achievementBadges = [
    { earned: true, label: "Member", desc: "Joined the Sant.Ai community", icon: <Users className="h-4 w-4" /> },
    { earned: user._count.ownedProjects >= 1, label: "Project Creator", desc: "Created your first project", icon: <GitBranch className="h-4 w-4" /> },
    { earned: totalProjects >= 3, label: "Collaborator", desc: "Joined or created 3+ projects", icon: <Award className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 50, label: "Active Contributor", desc: "Earned 50+ reputation points", icon: <Activity className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 200, label: "Lead Contributor", desc: "Earned 200+ reputation points", icon: <Star className="h-4 w-4" /> },
    { earned: user.level === "Expert", label: "Expert", desc: "Reached Expert level", icon: <Target className="h-4 w-4" /> },
    { earned: user._count.contributions >= 10, label: "Dedicated", desc: "Made 10+ contributions", icon: <Award className="h-4 w-4" /> },
  ];
  const locked = [
    { earned: false, label: "Community Leader", desc: "Lead a project with 3+ members", icon: <Users className="h-4 w-4" /> },
    { earned: false, label: "Mentor", desc: "Help 5+ new members get started", icon: <Star className="h-4 w-4" /> },
    { earned: false, label: "Innovator", desc: "Create a project with 100+ views", icon: <Target className="h-4 w-4" /> },
  ];

  const sidebarStats = { followers: 0, following: 0 };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-72">
        <div className="lg:sticky lg:top-24">
          <ProfileSidebar
            user={{
              name: user.name,
              username: user.username,
              image: user.image,
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

      <main className="min-w-0 flex-1">
        <ProfileTabs username={username} defaultTab={defaultTab}>
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
                <h2 className="mb-4 font-heading text-base font-bold text-text">Recent Activity</h2>
                <div className="rounded-xl border border-border bg-surface/30 p-5">
                  <ActivityTimeline activities={activityItems} />
                </div>
              </section>
            )}

            {user.ownedProjects.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-base font-bold text-text">Featured Projects</h2>
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
                <p className="text-sm text-muted">This profile has no activity yet.</p>
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
                <p className="mt-2 text-sm text-muted">No projects yet.</p>
              </div>
            )}
          </div>

          {/* Articles */}
          <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted" />
            <p className="mt-2 text-sm text-muted">
              No articles yet. User-published articles will appear here.
            </p>
          </div>

          {/* Activity */}
          <div>
            {activityItemsAll.length > 0 ? (
              <div className="rounded-lg border border-border bg-surface/5 p-4">
                {activityItemsAll.map((item) => (
                  <ActivityItem
                    key={item.id}
                    icon={item.icon}
                    description={item.description}
                    date={fmtDate(item.date)}
                    points={item.points}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
                <Activity className="mx-auto h-6 w-6 text-muted" />
                <p className="mt-2 text-sm text-muted">No activity yet.</p>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-8">
            <div className="rounded-lg border border-border bg-surface/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text">Reputation Level</p>
                  <p className="text-2xl font-bold text-text">{user.reputationPoints} pts</p>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {user.level}
                </span>
              </div>
            </div>

            {achievementBadges.filter((b) => b.earned).length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Earned</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {achievementBadges.filter((b) => b.earned).map((b) => (
                    <BadgeItem key={b.label} {...b} />
                  ))}
                </div>
              </section>
            )}

            {achievementBadges.filter((b) => !b.earned).length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Locked</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {achievementBadges.filter((b) => !b.earned).concat(locked).slice(0, 4).map((b) => (
                    <BadgeItem key={b.label} {...b} earned={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </ProfileTabs>
      </main>
    </div>
  );
}
