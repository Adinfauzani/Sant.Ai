"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireAimUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Login required");
  return session.user;
}

export async function createAimChat(): Promise<{ id: string }> {
  const user = await requireAimUser();
  const chat = await prisma.aiMuChat.create({
    data: { userId: user.id, title: "Percakapan baru" },
  });
  return { id: chat.id };
}

export interface AimChatMessageData {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

export interface AimChatData {
  id: string;
  title: string;
  messages: AimChatMessageData[];
};

export async function getAimChat(id: string): Promise<AimChatData | null> {
  const user = await requireAimUser();
  const chat = await prisma.aiMuChat.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!chat || chat.userId !== user.id) return null;
  return {
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  };
}

export async function listAimChats(): Promise<Array<{ id: string; title: string; updatedAt: Date }>> {
  const user = await requireAimUser();
  const chats = await prisma.aiMuChat.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
  return chats;
}

export async function renameAimChat(id: string, title: string): Promise<void> {
  const user = await requireAimUser();
  const trimmed = title.trim();
  if (!trimmed) return;
  await prisma.aiMuChat.updateMany({
    where: { id, userId: user.id },
    data: { title: trimmed.slice(0, 120) },
  });
}

export async function deleteAimChat(id: string): Promise<void> {
  const user = await requireAimUser();
  await prisma.aiMuChat.deleteMany({ where: { id, userId: user.id } });
}