import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { BoardDetailClient } from "./_boardDetailClient";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const session = await getAuthSession(await headers());
  if (!session?.user) redirect("/login");

  const { boardId } = await params;

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
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
              labels: { include: { label: true } },
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

  if (!board) redirect("/dashboard/boards");

  const isOwner = board.ownerId === session.user.id;
  const boardJson = JSON.parse(JSON.stringify(board));

  return <BoardDetailClient board={boardJson} isOwner={isOwner} />;
}
