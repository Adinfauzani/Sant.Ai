"use server";

import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { auth, signIn } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateUsername } from "./reserved";

const LEVEL_THRESHOLDS = [
  { level: "Beginner", min: 0 },
  { level: "Active", min: 50 },
  { level: "Lead", min: 200 },
  { level: "Expert", min: 500 },
];

function calculateLevel(points: number): string {
  let current = "Beginner";
  for (const t of LEVEL_THRESHOLDS) {
    if (points >= t.min) current = t.level;
  }
  return current;
}

async function addContribution(
  userId: string,
  projectId: string,
  points: number,
  type: string,
  description: string,
) {
  await prisma.contribution.create({
    data: { userId, projectId, points, type, description },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newPoints = user.reputationPoints + points;
  const newLevel = calculateLevel(newPoints);

  await prisma.user.update({
    where: { id: userId },
    data: { reputationPoints: newPoints, level: newLevel },
  });
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const studyProgram = formData.get("studyProgram") as string;
  const semester = parseInt(formData.get("semester") as string) || 1;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 12);

  const username = generateUsername(name);

  await prisma.user.create({
    data: { name, username, email, password: hashed, studyProgram, semester },
  });

  await signIn("credentials", { email, password, redirect: false });
  redirect("/profile");
}

export async function loginUser(formData: FormData) {
  await signIn("credentials", {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirect: false,
  });
  redirect("/profile");
}

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const problemStatement = (formData.get("problemStatement") as string) || "";
  const techStack = (formData.get("techStack") as string) || "";
  const sd = parseInt(formData.get("sd") as string) || 0;
  const ti = parseInt(formData.get("ti") as string) || 0;
  const si = parseInt(formData.get("si") as string) || 0;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      problemStatement,
      techStack,
      creatorId: session.user.id,
      projectRoles: {
        create: [
          ...(sd > 0 ? [{ studyProgram: "SD", required: sd, filled: 0 }] : []),
          ...(ti > 0 ? [{ studyProgram: "TI", required: ti, filled: 0 }] : []),
          ...(si > 0 ? [{ studyProgram: "SI", required: si, filled: 0 }] : []),
        ],
      },
    },
    include: { projectRoles: true },
  });

  await addContribution(
    session.user.id,
    project.id,
    10,
    "create",
    "Created a new project",
  );

  revalidatePath("/showcase");
  revalidatePath("/");
  redirect(`/projects/${project.id}`);
}

export async function joinProject(projectId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) throw new Error("User not found");

  const existing = await prisma.teamMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });
  if (existing) throw new Error("Already a member");

  const projectRole = await prisma.projectRole.findFirst({
    where: { projectId, studyProgram: user.studyProgram },
  });

  const member = await prisma.teamMember.create({
    data: { projectId, userId: session.user.id, role },
  });

  if (projectRole && projectRole.filled < projectRole.required) {
    await prisma.projectRole.update({
      where: { id: projectRole.id },
      data: { filled: projectRole.filled + 1 },
    });
  }

  await addContribution(
    session.user.id,
    projectId,
    5,
    "join",
    "Joined a project",
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/showcase");
  return member;
}

export async function completeProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project || project.creatorId !== session.user.id)
    throw new Error("Only the creator can mark as completed");

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "Completed" },
  });

  const members = await prisma.teamMember.findMany({
    where: { projectId },
  });

  for (const member of members) {
    await addContribution(
      member.userId,
      projectId,
      20,
      "complete",
      "Project completed",
    );
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/showcase");
}

/* ── Ideas actions (removed — Ideas removed from navigation) ── */

export async function addComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  const projectId = formData.get("projectId") as string;

  if (!content || !projectId) throw new Error("Missing fields");

  await prisma.comment.create({
    data: { content, userId: session.user.id, projectId },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;
  const avatar = (formData.get("avatar") as string) || "";
  const website = formData.get("website") as string;
  const location = formData.get("location") as string;

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      throw new Error("Username already taken");
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, username, bio, avatar, website, location },
  });

  revalidatePath(`/${session.user.username || username}`);
  revalidatePath("/dashboard");
}
