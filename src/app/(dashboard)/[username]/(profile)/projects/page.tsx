import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { FolderOpen, Pin } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";
import PinnedCard from "./_pinnedCard";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileProjectsPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      pinnedProjects: true,
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
      teamMembers: {
        include: {
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
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const session = await getAuthSession(await headers());
  const isOwner = session?.user?.id === user.id;

  let pinnedIds: string[] = [];
  try {
    pinnedIds = JSON.parse(user.pinnedProjects || "[]");
  } catch { /* ignore */ }

  const joinedProjects = user.teamMembers.map((tm) => tm.project);
  const allProjects = [...user.ownedProjects, ...joinedProjects];
  const seen = new Set<string>();
  const uniqueProjects = allProjects.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return (
    <div>
      {uniqueProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {uniqueProjects.map((p) => (
            <PinnedCard
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
  );
}
