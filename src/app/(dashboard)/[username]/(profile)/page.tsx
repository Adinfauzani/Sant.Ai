import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, GitBranch, Award, Users, Activity, Eye } from "lucide-react";
import ProfileSidebar from "@/components/profile/profileSidebar";
import ProfileReadme from "@/components/profile/profileReadme";
import ProfileStatistics from "@/components/profile/profileStatistics";
import CommunityCard from "@/components/profile/communityCard";
import ActivityTimeline from "@/components/profile/activityTimeline";
import ProjectCard from "@/components/profile/projectCard";
import PinnedProjects from "@/components/profile/pinnedProjects";
import ContributionGraph from "@/components/profile/contributionGraph";
import StreakCounter from "@/components/profile/streakCounter";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";
import { headers } from "next/headers";
import { getAuthSession } from "@/lib/auth";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileOverviewPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

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
        take: 3,
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
        take: 5,
        select: {
          id: true,
          role: true,
          joinedAt: true,
          project: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const totalProjects = user._count.ownedProjects + user._count.teamMembers;
  const recentContributions = user.contributions.slice(0, 5);

  // Merge + sort activity
  const activityItems = [
    ...recentContributions.map((c) => ({
      id: c.id,
      icon: <Activity className="h-3 w-3" />,
      description: c.description,
      date: c.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      points: c.points,
      type: c.type,
    })),
    ...user.teamMembers.map((tm) => ({
      id: tm.id,
      icon: <Users className="h-3 w-3" />,
      description: `Joined project "${tm.project.title}" as ${tm.role}`,
      date: tm.joinedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      points: undefined as number | undefined,
      type: "join" as string | undefined,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Compute badges
  const badges = [
    { earned: true, label: "Member", desc: "Joined the Sant.AI community", icon: <Users className="h-4 w-4" /> },
    { earned: user._count.ownedProjects >= 1, label: "Project Creator", desc: "Created your first project on the platform", icon: <GitBranch className="h-4 w-4" /> },
    { earned: totalProjects >= 3, label: "Collaborator", desc: "Joined or created 3+ projects", icon: <Award className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 50, label: "Active Contributor", desc: "Earned 50+ reputation points through contributions", icon: <Activity className="h-4 w-4" /> },
    { earned: user.level === "Expert", label: "Expert", desc: "Reached the Expert level", icon: <Award className="h-4 w-4" /> },
  ].filter((b) => b.earned).slice(0, 5);

  // Tech stack from projects
  const allTech = new Set<string>();
  user.ownedProjects.forEach((p) => {
    try {
      const stack = typeof p.techStack === "string" ? JSON.parse(p.techStack) : p.techStack;
      if (Array.isArray(stack)) stack.forEach((t: string) => allTech.add(t));
    } catch { /* ignore */ }
  });
  // Also check team member projects — but we only have the title, not tech stack :(
  const techStack = Array.from(allTech).slice(0, 12);

  // Pinned projects
  let pinnedProjectData: any[] = [];
  try {
    const pinnedIds: string[] = JSON.parse(user.pinnedProjects || "[]");
    if (pinnedIds.length > 0) {
      pinnedProjectData = await prisma.project.findMany({
        where: { id: { in: pinnedIds } },
        select: { id: true, title: true, description: true, status: true, techStack: true, demoLink: true },
      });
    }
  } catch { /* ignore */ }

  const session = await getAuthSession(await headers());
  const isOwner = session?.user?.id === user.id;

  // Stats for sidebar / right panel
  const sidebarStats = { followers: 0, following: 0 };
  const dashboardStats = [
    { label: "Reputation", value: user.reputationPoints, icon: <Award className="h-3 w-3" /> },
    { label: "Projects", value: totalProjects, icon: <GitBranch className="h-3 w-3" /> },
    { label: "Articles", value: 0, icon: <FileText className="h-3 w-3" /> },
    { label: "Contributions", value: user._count.contributions, icon: <Activity className="h-3 w-3" /> },
    { label: "Ideas", value: user._count.ideas, icon: <Eye className="h-3 w-3" /> },
    { label: "Teams", value: user._count.teamMembers, icon: <Users className="h-3 w-3" /> },
  ];

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-72">
        <div className="lg:sticky lg:top-24">
          <ProfileSidebar
            user={{
              name: user.name,
              username: user.username,
              avatar: user.avatar,
              bio: user.bio,
              location: user.location,
              website: user.website,
              reputationPoints: user.reputationPoints,
              level: user.level,
              createdAt: user.createdAt,
              studyProgram: user.studyProgram,
              semester: user.semester,
            }}
            stats={sidebarStats}
            badges={badges}
            techStack={techStack}
            isOwner={isOwner}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 space-y-8">
        {/* Contribution Graph + Streak */}
        <ContributionGraph contributions={user.contributions.map((c) => ({ createdAt: c.createdAt }))} />
        <StreakCounter contributions={user.contributions.map((c) => ({ createdAt: c.createdAt }))} />

        {/* Pinned Projects */}
        {pinnedProjectData.length > 0 && (
          <PinnedProjects projects={pinnedProjectData} />
        )}

        {/* README */}
        <ProfileReadme readme={user.readme} readmeType={user.readmeType as "text" | "markdown"} isOwner={isOwner} />

        {/* Activity Timeline */}
        {activityItems.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-base font-bold text-text">Recent Activity</h2>
            <div className="rounded-xl border border-border bg-surface/30 p-5">
              <ActivityTimeline activities={activityItems} />
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {user.ownedProjects.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-text">Featured Projects</h2>
              <Link href={`/${username}/projects`} className="text-[11px] text-muted hover:text-primary transition-colors">
                View all
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {user.ownedProjects.map((p) => (
                <ProjectCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {activityItems.length === 0 && user.ownedProjects.length === 0 && (
          <div className="rounded-xl border border-border bg-surface/30 p-12 text-center">
            <p className="text-sm text-muted">This profile has no activity yet.</p>
          </div>
        )}
      </main>

      {/* Right Panel */}
      <aside className="w-full shrink-0 lg:w-60">
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Statistics */}
          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted">Statistics</h3>
            <ProfileStatistics stats={dashboardStats} />
          </div>

          {/* Communities */}
          <CommunityCard communities={[]} />
        </div>
      </aside>
    </div>
  );
}
