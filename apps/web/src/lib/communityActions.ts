"use server";

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { notifyUser } from "@/lib/notify";

type ActionResult = { ok: boolean; error?: string };

async function requireUser() {
  const session = await getAuthSession(await headers());
  if (!session?.user?.id) throw new Error("Login required");
  if (!session.user.emailVerified) {
    throw new Error("You must verify your email before taking this action.");
  }
  return session.user;
}

export interface InviteeInput {
  id: string;
  username: string;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "komunitas"
  );
}

export async function searchUsers(q: string): Promise<{ id: string; name: string; username: string; image: string | null }[]> {
  let user;
  try {
    user = await requireUser();
  } catch {
    return [];
  }

  const needle = q.trim();
  if (!needle || needle.length < 2) return [];

  return prisma.user.findMany({
    where: {
      AND: [
        { banned: false },
        { id: { not: user.id } },
        {
          OR: [
            { username: { contains: needle, mode: "insensitive" } },
            { name: { contains: needle, mode: "insensitive" } },
            { email: { contains: needle, mode: "insensitive" } },
          ],
        },
      ],
    },
    take: 8,
    select: { id: true, name: true, username: true, image: true },
    orderBy: { reputationPoints: "desc" },
  });
}

export async function createCommunity(input: {
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  needs: string[];
  todos: string[];
  invites: InviteeInput[];
}): Promise<ActionResult & { slug?: string }> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const name = input.name.trim();
  const description = input.description.trim();
  const category = input.category.trim() || "Umum";
  const needs = [...new Set(input.needs.map((n) => n.trim()).filter(Boolean))];
  const todos = input.todos
    .map((t) => ({ id: crypto.randomUUID(), text: t.trim() }))
    .filter((t) => t.text);
  const inviteIds = [...new Set(input.invites.map((i) => i.id).filter(Boolean))];

  if (name.length < 2) return { ok: false, error: "Nama komunitas minimal 2 karakter." };
  if (name.length > 60) return { ok: false, error: "Nama komunitas maksimal 60 karakter." };
  if (!description) return { ok: false, error: "Deskripsi wajib diisi." };
  if (description.length > 300) return { ok: false, error: "Deskripsi maksimal 300 karakter." };
  if (category.length > 40) return { ok: false, error: "Kategori maksimal 40 karakter." };
  if (input.coverImage && input.coverImage.length > 2_000_000) {
    return { ok: false, error: "Gambar cover terlalu besar (maks 2MB)." };
  }
  if (needs.length > 30) return { ok: false, error: "Maksimal 30 kebutuhan." };
  if (todos.length > 20) return { ok: false, error: "Maksimal 20 todo." };
  if (inviteIds.length > 50) return { ok: false, error: "Maksimal 50 undangan." };

  let slug = slugify(name);
  for (let i = 0; i < 3; i++) {
    const exists = await prisma.community.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${slugify(name)}-${Math.random().toString(36).substring(2, 6)}`;
  }

  let invited: { id: string; name: string }[] = [];
  if (inviteIds.length > 0) {
    invited = await prisma.user.findMany({
      where: { id: { in: inviteIds } },
      select: { id: true, name: true },
    });
  }

  await prisma.$transaction(async (tx) => {
    const community = await tx.community.create({
      data: {
        name,
        slug,
        description,
        category,
        coverImage: input.coverImage || null,
        needs: JSON.stringify(needs),
        todos: JSON.stringify(todos),
        leadUserId: user.id,
      },
    });
    await tx.communityMember.create({
      data: { communityId: community.id, userId: user.id, role: "lead" },
    });
    for (const invitee of invited) {
      await tx.communityInvite.create({
        data: {
          communityId: community.id,
          userId: invitee.id,
          invitedById: user.id,
        },
      }).catch(() => {});
    }
  });

  for (const invitee of invited) {
    await notifyUser({
      userId: invitee.id,
      type: "community",
      title: "Kamu diundang ke komunitas",
      body: `${user.name} mengundangmu bergabung ke ${name}.`,
      href: `/community/${slug}`,
      actorId: user.id,
    });
  }

  revalidatePath("/community");
  revalidatePath("/hub");
  return { ok: true, slug };
}

export async function joinCommunity(communitySlug: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const community = await prisma.community.findUnique({ where: { slug: communitySlug } });
  if (!community) return { ok: false, error: "Community not found" };

  await prisma.communityMember
    .create({
      data: { communityId: community.id, userId: user.id, role: "member" },
    })
    .catch(() => {});

  await prisma.communityInvite
    .updateMany({
      where: { communityId: community.id, userId: user.id, status: "pending" },
      data: { status: "accepted", acceptedAt: new Date() },
    })
    .catch(() => {});

  if (community.leadUserId && community.leadUserId !== user.id) {
    await notifyUser({
      userId: community.leadUserId,
      type: "community",
      title: "Anggota baru bergabung",
      body: `${user.name} bergabung ke ${community.name}.`,
      href: `/community/${community.slug}`,
      actorId: user.id,
    });
  }

  revalidatePath("/community");
  revalidatePath(`/community/${community.slug}`);
  revalidatePath("/hub");
  return { ok: true };
}

export async function leaveCommunity(communitySlug: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const community = await prisma.community.findUnique({ where: { slug: communitySlug } });
  if (!community) return { ok: false, error: "Community not found" };

  await prisma.communityMember
    .deleteMany({
      where: { communityId: community.id, userId: user.id },
    })
    .catch(() => {});

  revalidatePath("/community");
  revalidatePath(`/community/${community.slug}`);
  revalidatePath("/hub");
  return { ok: true };
}

export async function togglePostLike(postId: string): Promise<ActionResult & { liked?: boolean }> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      community: { select: { slug: true } },
      user: { select: { id: true } },
    },
  });
  if (!post) return { ok: false, error: "Post not found" };

  const existing = await prisma.communityPostLike.findUnique({
    where: { postId_userId: { postId, userId: user.id } },
  });

  if (existing) {
    await prisma.communityPostLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.communityPostLike.create({ data: { postId, userId: user.id } });
    if (post.user.id !== user.id) {
      await notifyUser({
        userId: post.user.id,
        type: "community",
        title: "Post baru disukai",
        body: `${user.name} menyukai post kamu.`,
        href: `/community/${post.community.slug}`,
        actorId: user.id,
      });
    }
  }

  revalidatePath("/community");
  revalidatePath(`/community/${post.community.slug}`);
  revalidatePath("/hub");
  return { ok: true, liked: !existing };
}

export async function toggleCommunityTodo(communityId: string, todoId: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) return { ok: false, error: "Community not found" };
  if (community.leadUserId !== user.id) return { ok: false, error: "Hanya lead yang bisa mengubah todo." };

  let todos: { id: string; text: string; done: boolean }[] = [];
  try {
    const parsed = JSON.parse(community.todos);
    if (Array.isArray(parsed)) todos = parsed;
  } catch { /* ignore */ }

  const idx = todos.findIndex((t) => t && t.id === todoId);
  if (idx === -1) return { ok: false, error: "Todo not found" };
  todos[idx].done = !todos[idx].done;

  await prisma.community.update({
    where: { id: communityId },
    data: { todos: JSON.stringify(todos) },
  });

  revalidatePath(`/community/${community.slug}`);
  return { ok: true };
}

export async function createPost(communityId: string, content: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Post content is empty" };
  if (trimmed.length > 500) return { ok: false, error: "Post must be under 500 characters" };

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) return { ok: false, error: "Community not found" };

  await prisma.communityPost.create({
    data: { communityId: community.id, userId: user.id, content: trimmed },
  });

  if (community.leadUserId && community.leadUserId !== user.id) {
    await notifyUser({
      userId: community.leadUserId,
      type: "community",
      title: "Diskusi baru di komunitasmu",
      body: `${user.name} memposting di ${community.name}.`,
      href: `/community/${community.slug}`,
      actorId: user.id,
    });
  }

  revalidatePath("/community");
  revalidatePath(`/community/${community.slug}`);
  revalidatePath("/hub");
  return { ok: true };
}