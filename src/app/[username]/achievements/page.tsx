import { notFound } from "next/navigation";
import { Award, Users, GitBranch, Activity, Star, Target } from "lucide-react";
import BadgeItem from "@/components/profile/badge-item";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileAchievementsPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      _count: {
        select: {
          ownedProjects: true,
          teamMembers: true,
          contributions: true,
        },
      },
    },
  });

  if (!user) notFound();

  const totalProjects = user._count.ownedProjects + user._count.teamMembers;
  const badges = [
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

  return (
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

      {badges.filter((b) => b.earned).length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Earned</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {badges.filter((b) => b.earned).map((b) => (
              <BadgeItem key={b.label} {...b} />
            ))}
          </div>
        </section>
      )}

      {badges.filter((b) => !b.earned).length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Locked</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {badges.filter((b) => !b.earned).concat(locked).slice(0, 4).map((b) => (
              <BadgeItem key={b.label} {...b} earned={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
