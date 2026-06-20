import { notFound } from "next/navigation";
import { FolderOpen } from "lucide-react";
import ProjectCard from "@/components/profile/project-card";
import { prisma } from "@/lib/db";
import { isReservedUsername } from "@/lib/reserved";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfileProjectsPage({ params }: Props) {
  const { username } = await params;
  if (isReservedUsername(username)) notFound();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
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
            <ProjectCard key={p.id} {...p} />
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
