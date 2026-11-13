import { prisma } from "@/lib/db";
import type { ProjectCardData, ProjectCardRole } from "@/components/project/ProjectCard";

export interface ShowcaseProject extends ProjectCardData {
  problemStatement: string;
}

const STATUS_PROGRESS: Record<string, number> = {
  Open: 40,
  "In Progress": 65,
  Review: 85,
  Completed: 100,
};

export async function getShowcaseProjects(): Promise<ShowcaseProject[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          studyProgram: true,
          university: true,
        },
      },
      teamMembers: {
        include: {
          user: { select: { id: true, studyProgram: true } },
        },
      },
      projectRoles: true,
      contributions: { select: { userId: true, points: true } },
    },
  });

  return projects.map((p) => {
    const techStack = p.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const programSet = new Set<string>();
    if (p.creator.studyProgram) programSet.add(p.creator.studyProgram);
    for (const m of p.teamMembers) {
      if (m.user.studyProgram) programSet.add(m.user.studyProgram);
    }
    const programs = ["SD", "TI", "SI"].filter((x) => programSet.has(x));

    const impact = p.contributions.reduce((sum, c) => sum + c.points, 0);
    const contributorIds = new Set<string>([
      p.creator.id,
      ...p.teamMembers.map((m) => m.user.id),
      ...p.contributions.map((c) => c.userId),
    ]);

    const openRoles: ProjectCardRole[] = p.projectRoles.map((r) => ({
      program: r.studyProgram,
      title: r.studyProgram,
      filled: r.filled,
      required: r.required,
    }));

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      problemStatement: p.problemStatement,
      status: p.status,
      techStack,
      programs,
      progress: STATUS_PROGRESS[p.status] ?? 40,
      memberCount: p.teamMembers.length,
      maxMemberCount:
        p.teamMembers.length +
        p.projectRoles.reduce((sum, r) => sum + Math.max(r.required - r.filled, 0), 0),
      impact,
      votes: p.contributions.length,
      openRoles,
      createdAt: p.createdAt.toISOString(),
      creatorName: p.creator.name,
      university: p.creator.university || undefined,
      contributors: contributorIds.size,
    };
  });
}