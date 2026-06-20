import { notFound } from "next/navigation";
import { Activity, Users, Award, GitBranch } from "lucide-react";
import ActivityItem from "@/components/profile/activity-item";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileActivityPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
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
          project: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const items = [
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

  return (
    <div>
      {items.length > 0 ? (
        <div className="rounded-lg border border-border bg-surface/5 p-4">
          {items.map((item) => (
            <ActivityItem
              key={item.id}
              icon={item.icon}
              description={item.description}
              date={item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
  );
}
