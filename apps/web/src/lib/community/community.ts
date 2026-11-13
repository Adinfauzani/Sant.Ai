import { prisma } from "@/lib/db";
import { programColor } from "@/lib/community/communityPalette";

export interface CommunityCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  discussionCount: number;
}

export interface CommunityFeedPost {
  id: string;
  content: string;
  createdAt: string;
  communityId: string;
  communityName: string;
  communitySlug: string;
  authorName: string;
  username: string;
  program: string | null;
  likes: number;
}

export interface CommunityContributor {
  id: string;
  name: string;
  username: string;
  program: string | null;
  reputationPoints: number;
}

export interface CommunityUpcomingEvent {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  registered: number;
  color: string;
}

export interface CommunityMemberData {
  id: string;
  name: string;
  username: string;
  program: string | null;
  role: string;
  image: string | null;
}

export interface CommunityTodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CommunityInviteData {
  id: string;
  name: string;
  username: string;
  program: string | null;
}

export interface CommunityPostData {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  username: string;
  program: string | null;
  likes: number;
  likedByMe: boolean;
}

export interface CommunityDetailData {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  color: string;
  coverImage: string | null;
  rules: string[];
  topics: string[];
  needs: string[];
  todos: CommunityTodoItem[];
  pendingInvites: CommunityInviteData[];
  isLead: boolean;
  memberCount: number;
  discussionCount: number;
  isMember: boolean;
  lead: { id: string; name: string; program: string | null } | null;
  members: CommunityMemberData[];
  posts: CommunityPostData[];
}

export interface CommunityData {
  communities: CommunityCardData[];
  feedPosts: CommunityFeedPost[];
  contributors: CommunityContributor[];
  upcomingEvents: CommunityUpcomingEvent[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function parseJsonArray<T>(value: string): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function getCommunityData(): Promise<CommunityData> {
  const now = new Date();

  const [communities, feedPosts, contributors, upcomingEvents] = await Promise.all([
    prisma.community.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { members: true, posts: true } } },
    }),
    prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        community: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, username: true, image: true, studyProgram: true } },
        _count: { select: { likes: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { reputationPoints: "desc" },
      take: 5,
      select: { id: true, name: true, username: true, studyProgram: true, reputationPoints: true },
    }),
    prisma.event.findMany({
      where: { startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        startAt: true,
        _count: { select: { registrations: true } },
      },
    }),
  ]);

  return {
    communities: communities.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      category: c.category,
      memberCount: c._count.members,
      discussionCount: c._count.posts,
    })),
    feedPosts: feedPosts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
      communityId: p.community.id,
      communityName: p.community.name,
      communitySlug: p.community.slug,
      authorName: p.user.name,
      username: p.user.username,
      program: p.user.studyProgram,
      likes: p._count.likes,
    })),
    contributors: contributors.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      program: u.studyProgram,
      reputationPoints: u.reputationPoints,
    })),
    upcomingEvents: upcomingEvents.map((e, i) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      dateLabel: DATE_FORMATTER.format(e.startAt),
      registered: e._count.registrations,
      color: programColor(i),
    })),
  };
}

export async function getCommunityDetail(
  slug: string,
  viewerId?: string,
): Promise<CommunityDetailData | null> {
  const community = await prisma.community.findUnique({
    where: { slug },
    include: {
      lead: { select: { id: true, name: true, studyProgram: true } },
      members: {
        include: { user: { select: { id: true, name: true, username: true, image: true, studyProgram: true } } },
        orderBy: { joinedAt: "asc" },
      },
      posts: {
        include: {
          user: { select: { id: true, name: true, username: true, studyProgram: true } },
          _count: { select: { likes: true } },
          likes: viewerId ? { where: { userId: viewerId } } : false,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { members: true, posts: true } },
      invites: {
        where: { status: "pending" },
        include: { user: { select: { id: true, name: true, username: true, studyProgram: true } } },
      },
    },
  });

  if (!community) return null;

  let todos: CommunityTodoItem[] = [];
  try {
    const parsed = JSON.parse(community.todos);
    if (Array.isArray(parsed)) {
      todos = parsed
        .filter(
          (t): t is { id: string; text: string; done: boolean } =>
            t && typeof t.id === "string" && typeof t.text === "string" && typeof t.done === "boolean",
        )
        .map((t) => ({ id: t.id, text: t.text, done: t.done }));
    }
  } catch { /* ignore */ }

  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    description: community.description,
    fullDescription: community.fullDescription,
    category: community.category,
    color: "from-blue-600 to-cyan-500",
    coverImage: community.coverImage,
    rules: parseJsonArray<string>(community.rules),
    topics: parseJsonArray<string>(community.topics),
    needs: parseJsonArray<string>(community.needs),
    todos,
    pendingInvites: community.invites.map((i) => ({
      id: i.user.id,
      name: i.user.name,
      username: i.user.username,
      program: i.user.studyProgram,
    })),
    isLead: Boolean(viewerId && community.leadUserId === viewerId),
    memberCount: community._count.members,
    discussionCount: community._count.posts,
    isMember: viewerId
      ? community.members.some((m) => m.user.id === viewerId)
      : false,
    lead: community.lead
      ? { id: community.lead.id, name: community.lead.name, program: community.lead.studyProgram }
      : null,
    members: community.members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      username: m.user.username,
      program: m.user.studyProgram,
      role: m.role,
      image: m.user.image,
    })),
    posts: community.posts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
      authorName: p.user.name,
      username: p.user.username,
      program: p.user.studyProgram,
      likes: p._count.likes,
      likedByMe: viewerId ? p.likes.length > 0 : false,
    })),
  };
}