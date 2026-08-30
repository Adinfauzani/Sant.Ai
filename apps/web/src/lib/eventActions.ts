"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type ActionResult = { ok: boolean; error?: string; registered?: boolean };

async function requireUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Login required");
  if (!session.user.emailVerified) {
    throw new Error("You must verify your email before taking this action.");
  }
  return session.user;
}

export async function registerForEvent(eventSlug: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const event = await prisma.event.findUnique({
    where: { slug: eventSlug },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return { ok: false, error: "Event not found" };

  if (event.status === "Closed" || event.startAt < new Date()) {
    return { ok: false, error: "This event is no longer open for registration" };
  }

  if (event.maxParticipants > 0 && event._count.registrations >= event.maxParticipants) {
    return { ok: false, error: "Event is full" };
  }

  const created = await prisma.eventRegistration
    .create({ data: { eventId: event.id, userId: user.id } })
    .then(() => true)
    .catch(() => false);

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/hub");
  return { ok: created, registered: created, error: created ? undefined : "Already registered" };
}

export async function unregisterFromEvent(eventSlug: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event) return { ok: false, error: "Event not found" };

  await prisma.eventRegistration.deleteMany({
    where: { eventId: event.id, userId: user.id },
  });

  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/hub");
  return { ok: true, registered: false };
}