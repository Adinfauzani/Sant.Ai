import type { ProjectCardData } from "@/components/project/ProjectCard";

type ProjectRoleRaw = { id: string; projectId: string; studyProgram: string; required: number; filled: number };
type TeamMemberRaw = { user: { studyProgram: string } };
type ContributionRaw = { points: number };

interface ProjectRaw {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string;
  createdAt: Date;
  creator: { name: string };
  projectRoles: ProjectRoleRaw[];
  teamMembers: TeamMemberRaw[];
  contributions: ContributionRaw[];
  _count: { teamMembers: number; comments: number };
}

function mapStatus(dbStatus: string): ProjectCardData["status"] {
  const map: Record<string, ProjectCardData["status"]> = {
    Open: "Recruiting",
    "In Progress": "Active",
    Planning: "Planning",
    Review: "Review",
    Completed: "Completed",
  };
  return map[dbStatus] ?? "Planning";
}

function uniquePrograms(
  roles: { studyProgram: string }[],
  members: { user: { studyProgram: string } }[],
): string[] {
  const set = new Set<string>();
  roles.forEach((r) => set.add(r.studyProgram));
  members.forEach((m) => set.add(m.user.studyProgram));
  return Array.from(set);
}

export function toProjectCardData(project: ProjectRaw): ProjectCardData {
  const openRoles = project.projectRoles
    .filter((r) => r.filled < r.required)
    .map((r) => ({
      program: r.studyProgram,
      title: `${r.studyProgram} Contributor`,
      filled: r.filled,
      required: r.required,
    }));

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: mapStatus(project.status),
    techStack: project.techStack ? project.techStack.split(",").map((t) => t.trim()).filter(Boolean) : [],
    memberCount: project._count.teamMembers,
    maxMemberCount: project.projectRoles.reduce((a, r) => a + r.required, 0),
    impact: project.contributions.reduce((sum, c) => sum + c.points, 0),
    votes: 0,
    programs: uniquePrograms(project.projectRoles, project.teamMembers),
    progress:
      project.status === "Completed" ? 100
      : project.status === "In Progress" ? 65
      : project.status === "Open" ? 15
      : 40,
    openRoles,
    createdAt: project.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    projectLead: project.creator.name,
    discussionCount: project._count.comments,
    milestonesCompleted:
      project.status === "Completed" ? project.projectRoles.length + 1
      : project.status === "In Progress" ? 2
      : 0,
  };
}
