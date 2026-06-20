import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, GitBranch, Award, Users, Activity } from "lucide-react";
import StatsCard from "@/components/profile/stats-card";
import ProjectCard from "@/components/profile/project-card";
import ActivityItem from "@/components/profile/activity-item";
import BadgeItem from "@/components/profile/badge-item";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

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
        take: 5,
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
  const activityItems = [
    ...user.contributions.map((c) => ({
      id: c.id,
      icon: <Activity className="h-3 w-3" />,
      description: c.description,
      date: c.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      points: c.points,
    })),
    ...user.teamMembers.map((tm) => ({
      id: tm.id,
      icon: <Users className="h-3 w-3" />,
      description: `Joined project "${tm.project.title}" as ${tm.role}`,
      date: tm.joinedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      points: undefined as number | undefined,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const level = user.level;
  const badges = [
    { earned: true, label: "Member", desc: "Joined the community", icon: <Users className="h-4 w-4" /> },
    { earned: user._count.ownedProjects >= 1, label: "Project Creator", desc: "Created your first project", icon: <GitBranch className="h-4 w-4" /> },
    { earned: totalProjects >= 3, label: "Collaborator", desc: "Joined or created 3+ projects", icon: <Award className="h-4 w-4" /> },
    { earned: user.reputationPoints >= 50, label: "Active Contributor", desc: "Earned 50+ reputation points", icon: <Activity className="h-4 w-4" /> },
    { earned: level === "Expert", label: "Expert", desc: "Reached Expert level", icon: <Award className="h-4 w-4" /> },
  ].filter((b) => b.earned).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="Reputation" value={user.reputationPoints} icon={<Award className="h-4 w-4" />} />
        <StatsCard label="Projects" value={totalProjects} icon={<GitBranch className="h-4 w-4" />} />
        <StatsCard label="Articles" value={0} icon={<FileText className="h-4 w-4" />} />
        <StatsCard label="Contributions" value={user._count.contributions} icon={<Activity className="h-4 w-4" />} />
      </div>

      {activityItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Recent Activity</h2>
          <div className="rounded-lg border border-border bg-surface/5 p-4">
            {activityItems.length > 0 ? activityItems.map((item) => (
              <ActivityItem key={item.id} icon={item.icon} description={item.description} date={item.date} points={item.points} />
            )) : (
              <p className="py-4 text-center text-[10px] text-muted">No recent activity</p>
            )}
          </div>
        </section>
      )}

      {user.ownedProjects.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Featured Projects</h2>
            <Link href={`/${username}/projects`} className="text-[10px] text-muted hover:text-primary">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {user.ownedProjects.map((p) => (
              <ProjectCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}

      {badges.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Achievements</h2>
            <Link href={`/${username}/achievements`} className="text-[10px] text-muted hover:text-primary">View all</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {badges.map((b) => (
              <BadgeItem key={b.label} {...b} />
            ))}
          </div>
        </section>
      )}

      {activityItems.length === 0 && user.ownedProjects.length === 0 && badges.length === 0 && (
        <div className="rounded-lg border border-border bg-surface/5 p-10 text-center">
          <p className="text-sm text-muted">This profile has no activity yet.</p>
        </div>
      )}
    </div>
  );
}
