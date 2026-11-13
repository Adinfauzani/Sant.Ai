import { prisma } from "@/lib/db";

export function notifyUser(data: {
  userId: string;
  type?: string;
  title: string;
  body?: string;
  href?: string;
  actorId?: string;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type ?? "system",
      title: data.title,
      body: data.body ?? "",
      href: data.href ?? "",
      actorId: data.actorId,
    },
  });
}