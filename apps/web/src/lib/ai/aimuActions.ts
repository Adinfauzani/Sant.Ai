"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function requireAimUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Login required");
  return session.user;
}

export async function createAimChat(title?: string): Promise<{ id: string }> {
  const user = await requireAimUser();
  const trimmed = (title ?? "").trim().slice(0, 120);
  const chat = await prisma.aiMuChat.create({
    data: { userId: user.id, title: trimmed || "Percakapan baru" },
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

/** Ringkasan percakapan untuk sidebar (tanpa memuat isi pesan). */
export interface AimChatSummary {
  id: string;
  title: string;
  updatedAt: Date;
  pinned: boolean;
  archivedAt: Date | null;
  projectId: string | null;
}

const SUMMARY_SELECT = {
  id: true,
  title: true,
  updatedAt: true,
  pinned: true,
  archivedAt: true,
  projectId: true,
} as const;

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

export async function listAimChats(): Promise<AimChatSummary[]> {
  const user = await requireAimUser();
  const chats = await prisma.aiMuChat.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: SUMMARY_SELECT,
  });
  return chats;
}

/**
 * Pencarian judul + isi pesan. Dipakai sidebar saat pengguna mengetik, supaya
 * percakapan lama tetap ketemu walau judulnya tidak memuat kata kunci.
 */
export async function searchAimChats(query: string): Promise<AimChatSummary[]> {
  const user = await requireAimUser();
  const q = query.trim();
  if (!q) return listAimChats();
  return prisma.aiMuChat.findMany({
    where: {
      userId: user.id,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        {
          messages: {
            some: { content: { contains: q, mode: "insensitive" } },
          },
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 60,
    select: SUMMARY_SELECT,
  });
}

export async function setAimChatPinned(id: string, pinned: boolean): Promise<void> {
  const user = await requireAimUser();
  await prisma.aiMuChat.updateMany({
    where: { id, userId: user.id },
    data: { pinned },
  });
}

export async function archiveAimChat(id: string): Promise<void> {
  const user = await requireAimUser();
  await prisma.aiMuChat.updateMany({
    where: { id, userId: user.id },
    data: { archivedAt: new Date() },
  });
}

export async function restoreAimChat(id: string): Promise<void> {
  const user = await requireAimUser();
  await prisma.aiMuChat.updateMany({
    where: { id, userId: user.id },
    data: { archivedAt: null },
  });
}

export interface AimProjectOption {
  id: string;
  title: string;
}

/** Proyek milik pengguna yang bisa dipakai untuk menautkan percakapan. */
export async function listAimProjects(): Promise<AimProjectOption[]> {
  const user = await requireAimUser();
  return prisma.project.findMany({
    where: { creatorId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function setAimChatProject(
  id: string,
  projectId: string | null,
): Promise<void> {
  const user = await requireAimUser();
  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, creatorId: user.id },
      select: { id: true },
    });
    if (!project) throw new Error("Proyek tidak ditemukan");
  }
  await prisma.aiMuChat.updateMany({
    where: { id, userId: user.id },
    data: { projectId },
  });
}

export interface AimUsage {
  chats: number;
  messages: number;
  pinned: number;
  archived: number;
}

/** Angka ringkas untuk menu "Penggunaan & Batas" di sidebar. */
export async function getAimUsage(): Promise<AimUsage> {
  const user = await requireAimUser();
  const [chats, messages, pinned, archived] = await Promise.all([
    prisma.aiMuChat.count({ where: { userId: user.id } }),
    prisma.aiMuChatMessage.count({ where: { chat: { userId: user.id } } }),
    prisma.aiMuChat.count({ where: { userId: user.id, pinned: true } }),
    prisma.aiMuChat.count({
      where: { userId: user.id, archivedAt: { not: null } },
    }),
  ]);
  return { chats, messages, pinned, archived };
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

/**
 * Menghapus satu pesan beserta semua pesan setelahnya (balasan dan percakapan
 * berikutnya). Dipakai saat pesan pengguna diedit, diulang, atau dihapus agar
 * transkrip di server tetap sama dengan yang tampil di layar.
 *
 * `messageId` dipakai kalau id pesan itu berasal dari database. Kalau pesan
 * dibuat pada sesi berjalan (id dari AI SDK, bukan id baris database), pencarian
 * fallback memakai isi pesan sebagai penanda.
 */
export async function deleteAimMessagesFrom(
  chatId: string,
  messageId?: string,
  text?: string,
): Promise<void> {
  const user = await requireAimUser();
  const chat = await prisma.aiMuChat.findFirst({
    where: { id: chatId, userId: user.id },
    select: { id: true },
  });
  if (!chat) return;

  let target: { id: string; createdAt: Date } | null = null;
  if (messageId) {
    target = await prisma.aiMuChatMessage.findFirst({
      where: { id: messageId, chatId },
      select: { id: true, createdAt: true },
    });
  }
  if (!target && text) {
    target = await prisma.aiMuChatMessage.findFirst({
      where: { chatId, role: "user", content: text },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true },
    });
  }
  if (!target) return;

  await prisma.aiMuChatMessage.deleteMany({
    where: {
      chatId,
      OR: [
        { createdAt: { gt: target.createdAt } },
        // Several rows can share one timestamp, so the id breaks the tie.
        { createdAt: target.createdAt, id: { gte: target.id } },
      ],
    },
  });
}