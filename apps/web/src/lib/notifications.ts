"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string;
  readAt: string | null;
  createdAt: string;
  actorName: string | null;
}

export interface NotificationsPayload {
  unread: number;
  items: NotificationItem[];
}

async function requireUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Login required");
  return session.user;
}

export async function fetchNotifications(): Promise<NotificationsPayload> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { unread: 0, items: [] };
  }

  const [rows, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { actor: { select: { name: true } } },
    }),
    prisma.notification.count({
      where: { userId: user.id, readAt: null },
    }),
  ]);

  return {
    unread,
    items: rows.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      href: n.href,
      readAt: n.readAt?.toISOString() ?? null,
      createdAt: n.createdAt.toISOString(),
      actorName: n.actor?.name ?? null,
    })),
  };
}

export async function markNotificationRead(id: string) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false as const };
  }

  await prisma.notification.updateMany({
    where: { id, userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return { ok: true as const };
}

export async function markAllNotificationsRead() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false as const };
  }

  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/hub");
  return { ok: true as const };
}