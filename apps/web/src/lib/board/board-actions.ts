"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function getUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

const boardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  visibility: z.enum(["Private", "Team", "Public"]).optional(),
});

export async function createBoard(data: z.infer<typeof boardSchema>) {
  const user = await getUser();
  const parsed = boardSchema.parse(data);

  const board = await prisma.board.create({
    data: {
      name: parsed.name,
      description: parsed.description ?? "",
      icon: parsed.icon ?? "LayoutKanban",
      visibility: parsed.visibility ?? "Private",
      ownerId: user.id,
      columns: {
        create: [
          { name: "Backlog", order: 0 },
          { name: "Todo", order: 1 },
          { name: "In Progress", order: 2 },
          { name: "Review", order: 3 },
          { name: "Done", order: 4 },
        ],
      },
      members: {
        create: { userId: user.id, role: "Owner" },
      },
    },
    include: {
      columns: { orderBy: { order: "asc" } },
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
    },
  });

  revalidatePath("/dashboard/boards");
  return board;
}

export async function getBoards() {
  const user = await getUser();

  return prisma.board.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
        { visibility: "Public" },
      ],
    },
    include: {
      _count: { select: { tasks: true, members: true } },
      owner: { select: { id: true, name: true, image: true } },
      columns: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getBoard(boardId: string) {
  const user = await getUser();

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
        { visibility: "Public" },
      ],
    },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              assignees: {
                include: { user: { select: { id: true, name: true, image: true } } },
              },
              labels: {
                include: { label: true },
              },
              _count: { select: { comments: true, attachments: true } },
            },
          },
        },
      },
      labels: true,
      members: {
        include: { user: { select: { id: true, name: true, image: true, email: true } } },
      },
      owner: { select: { id: true, name: true, image: true } },
      _count: { select: { tasks: true } },
    },
  });

  if (!board) throw new Error("Board not found");
  return board;
}

export async function updateBoard(
  boardId: string,
  data: { name?: string; description?: string; icon?: string; coverImage?: string; visibility?: "Private" | "Team" | "Public" }
) {
  const user = await getUser();
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: user.id },
  });
  if (!board) throw new Error("Not found or unauthorized");

  const updated = await prisma.board.update({
    where: { id: boardId },
    data,
  });

  revalidatePath(`/dashboard/boards/${boardId}`);
  return updated;
}

export async function deleteBoard(boardId: string) {
  const user = await getUser();
  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: user.id },
  });
  if (!board) throw new Error("Not found or unauthorized");

  await prisma.board.delete({ where: { id: boardId } });
  revalidatePath("/dashboard/boards");
}

export async function createColumn(boardId: string, name: string) {
  const user = await getUser();
  const board = await prisma.board.findFirst({
    where: { id: boardId, members: { some: { userId: user.id, role: { in: ["Owner", "Admin", "Editor"] } } } },
  });
  if (!board) throw new Error("Unauthorized");

  const maxOrder = await prisma.boardColumn.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const column = await prisma.boardColumn.create({
    data: { boardId, name, order: (maxOrder?.order ?? -1) + 1 },
  });

  await logActivity(boardId, null, user.id, `added "${name}" column`);
  revalidatePath(`/dashboard/boards/${boardId}`);
  return column;
}

export async function updateColumn(columnId: string, data: { name?: string; color?: string }) {
  const column = await prisma.boardColumn.update({
    where: { id: columnId },
    data,
  });
  revalidatePath(`/dashboard/boards/${column.boardId}`);
  return column;
}

export async function deleteColumn(columnId: string) {
  const column = await prisma.boardColumn.findUnique({
    where: { id: columnId },
  });
  if (!column) throw new Error("Not found");

  await prisma.boardColumn.delete({ where: { id: columnId } });

  await logActivity(column.boardId, null, (await getUser()).id, `deleted "${column.name}" column`);
  revalidatePath(`/dashboard/boards/${column.boardId}`);
}

export async function reorderColumns(boardId: string, columnIds: string[]) {
  await prisma.$transaction(
    columnIds.map((id, index) =>
      prisma.boardColumn.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidatePath(`/dashboard/boards/${boardId}`);
}

export async function createTask(
  columnId: string,
  data: { title: string; description?: string; priority?: string; dueDate?: string }
) {
  const user = await getUser();
  const column = await prisma.boardColumn.findUnique({
    where: { id: columnId },
    include: { board: { select: { id: true } } },
  });
  if (!column) throw new Error("Column not found");

  const maxOrder = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      boardId: column.board.id,
      columnId,
      title: data.title,
      description: data.description ?? "",
      priority: (data.priority as any) ?? "Medium",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      order: (maxOrder?.order ?? 0) + 1,
      createdById: user.id,
    },
    include: {
      assignees: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      labels: { include: { label: true } },
    },
  });

  await logActivity(column.board.id, task.id, user.id, `added "${task.title}"`);
  revalidatePath(`/dashboard/boards/${column.board.id}`);
  return task;
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string | null;
    coverImage?: string | null;
    columnId?: string;
    order?: number;
  }
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { board: { select: { id: true } } },
  });
  if (!task) throw new Error("Task not found");

  const updateData: any = { ...data };
  if (data.dueDate === null) updateData.dueDate = null;
  else if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
  if (data.coverImage === null) updateData.coverImage = null;

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignees: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      labels: { include: { label: true } },
    },
  });

  await logActivity(task.board.id, taskId, (await getUser()).id, `updated "${updated.title}"`);
  revalidatePath(`/dashboard/boards/${task.board.id}`);
  return updated;
}

export async function deleteTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { board: { select: { id: true } } },
  });
  if (!task) throw new Error("Task not found");

  await prisma.task.delete({ where: { id: taskId } });

  await logActivity(task.board.id, null, (await getUser()).id, `deleted "${task.title}"`);
  revalidatePath(`/dashboard/boards/${task.board.id}`);
}

export async function moveTask(taskId: string, targetColumnId: string, order: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { board: { select: { id: true } } },
  });
  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: { id: taskId },
    data: { columnId: targetColumnId, order },
  });

  revalidatePath(`/dashboard/boards/${task.board.id}`);
}

export async function reorderTasks(taskId: string, newOrder: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { columnId: true, boardId: true },
  });
  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: { id: taskId },
    data: { order: newOrder },
  });

  revalidatePath(`/dashboard/boards/${task.boardId}`);
}

export async function addTaskAssignee(taskId: string, userId: string) {
  await prisma.taskAssignee.create({ data: { taskId, userId } });
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (task) revalidatePath(`/dashboard/boards/${task.boardId}`);
}

export async function removeTaskAssignee(taskId: string, userId: string) {
  await prisma.taskAssignee.delete({
    where: { taskId_userId: { taskId, userId } },
  });
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (task) revalidatePath(`/dashboard/boards/${task.boardId}`);
}

export async function addTaskLabel(taskId: string, labelId: string) {
  await prisma.taskLabel.create({ data: { taskId, labelId } });
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (task) revalidatePath(`/dashboard/boards/${task.boardId}`);
}

export async function removeTaskLabel(taskId: string, labelId: string) {
  await prisma.taskLabel.delete({
    where: { taskId_labelId: { taskId, labelId } },
  });
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (task) revalidatePath(`/dashboard/boards/${task.boardId}`);
}

export async function createLabel(boardId: string, name: string, color: string) {
  const label = await prisma.label.create({ data: { boardId, name, color } });
  revalidatePath(`/dashboard/boards/${boardId}`);
  return label;
}

export async function deleteLabel(labelId: string) {
  const label = await prisma.label.findUnique({ where: { id: labelId } });
  if (!label) throw new Error("Not found");
  await prisma.label.delete({ where: { id: labelId } });
  revalidatePath(`/dashboard/boards/${label.boardId}`);
}

export async function addComment(taskId: string, content: string) {
  const user = await getUser();
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (!task) throw new Error("Task not found");

  const comment = await prisma.taskComment.create({
    data: { taskId, userId: user.id, content },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  await logActivity(task.boardId, taskId, user.id, "commented");
  revalidatePath(`/dashboard/boards/${task.boardId}`);
  return comment;
}

export async function deleteComment(commentId: string) {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    include: { task: { select: { boardId: true } } },
  });
  if (!comment) throw new Error("Not found");
  await prisma.taskComment.delete({ where: { id: commentId } });
  revalidatePath(`/dashboard/boards/${comment.task.boardId}`);
}

export async function createChecklist(taskId: string, title?: string) {
  const checklist = await prisma.checklist.create({
    data: { taskId, title: title ?? "Checklist" },
  });
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { boardId: true },
  });
  if (task) revalidatePath(`/dashboard/boards/${task.boardId}`);
  return checklist;
}

export async function addChecklistItem(checklistId: string, content: string) {
  const maxOrder = await prisma.checklistItem.findFirst({
    where: { checklistId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const item = await prisma.checklistItem.create({
    data: { checklistId, content, order: (maxOrder?.order ?? -1) + 1 },
  });
  return item;
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { completed },
  });
}

export async function deleteChecklistItem(itemId: string) {
  await prisma.checklistItem.delete({ where: { id: itemId } });
}

export async function getTaskDetail(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignees: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      labels: { include: { label: true } },
      checklists: {
        include: { items: { orderBy: { order: "asc" } } },
      },
      attachments: {
        include: { uploadedBy: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      activity: {
        include: { actor: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      column: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function getBoardActivity(boardId: string) {
  return prisma.activityLog.findMany({
    where: { boardId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      actor: { select: { id: true, name: true, image: true } },
      task: { select: { id: true, title: true } },
    },
  });
}

async function logActivity(boardId: string, taskId: string | null, actorId: string, action: string) {
  await prisma.activityLog.create({
    data: { boardId, taskId, actorId, action },
  });
}
