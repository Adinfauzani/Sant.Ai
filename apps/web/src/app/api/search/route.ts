import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { SearchCategory, SearchHit, SearchResponse } from "@/lib/data/search"

const ADMIN_ROLES = ["sudo", "admin", "moderator"]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim() ?? ""
  const filter = (searchParams.get("filter") ?? "all") as SearchCategory
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const limit = 10

  const [session] = await Promise.all([
    getAuthSession(await headers()),
  ])

  const userRole = session?.user?.role ?? "user"
  const isAdmin = ADMIN_ROLES.includes(userRole)
  const currentUserId = session?.user?.id

  if (!q || q.length < 1) {
    return NextResponse.json<SearchResponse>({ results: [], total: 0 })
  }

  const searchTerm = `%${q}%`
  const results: SearchHit[] = []

  const addIf = (condition: boolean, fetcher: () => Promise<SearchHit[]>) => {
    if (condition) return fetcher()
    return Promise.resolve([])
  }

  const queries: Promise<SearchHit[]>[] = []

  if (filter === "all" || filter === "users") {
    queries.push(
      addIf(true, async () => {
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { username: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
              { university: { contains: q, mode: "insensitive" } },
              { studyProgram: { contains: q, mode: "insensitive" } },
            ],
            banned: false,
          },
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            role: true,
            studyProgram: true,
          },
        })
        return users.map((u) => ({
          id: u.id,
          type: "user" as const,
          title: u.name,
          subtitle: u.studyProgram
            ? `Mahasiswa • ${u.studyProgram}`
            : u.bio
              ? u.bio
              : `@${u.username}`,
          image: u.image ?? undefined,
          href: `/${u.username}`,
          badge: u.role !== "user" ? u.role : undefined,
        }))
      })
    )
  }

  if (filter === "all" || filter === "projects") {
    queries.push(
      (async () => {
        const projects = await prisma.project.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { techStack: { contains: q, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            creator: { select: { username: true } },
          },
        })
        return projects.map((p) => ({
          id: p.id,
          type: "project" as const,
          title: p.title,
          subtitle: p.description.slice(0, 100),
          href: `/projects/${p.id}`,
          badge: p.status,
        }))
      })()
    )
  }

  if (filter === "all" || filter === "ideas") {
    queries.push(
      (async () => {
        const ideas = await prisma.idea.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            voteCount: true,
            user: { select: { username: true } },
          },
        })
        return ideas.map((idea) => ({
          id: idea.id,
          type: "idea" as const,
          title: idea.title,
          subtitle: idea.description.slice(0, 100),
          href: `/${idea.user.username}`,
          badge: `${idea.voteCount} votes`,
        }))
      })()
    )
  }

  if (filter === "all" || filter === "articles") {
    queries.push(
      (async () => {
        const articles = await prisma.article.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            url: true,
            image: true,
          },
        })
        return articles.map((a) => ({
          id: a.id,
          type: "article" as const,
          title: a.title,
          subtitle: a.description.slice(0, 100),
          image: a.image || undefined,
          href: `/articles/${a.id}`,
          badge: a.category || undefined,
        }))
      })()
    )
  }

  if (filter === "all" || filter === "videos") {
    queries.push(
      (async () => {
        const videos = await prisma.youTubeVideo.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { channelName: { contains: q, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            title: true,
            channelName: true,
            thumbnail: true,
            views: true,
          },
        })
        return videos.map((v) => ({
          id: v.id,
          type: "video" as const,
          title: v.title,
          subtitle: v.channelName,
          image: v.thumbnail || undefined,
          href: `/intelligence/video/${v.id}`,
          badge: `${(v.views / 1000).toFixed(0)}k views`,
        }))
      })()
    )
  }

  if (filter === "all" || filter === "discussions") {
    queries.push(
      (async () => {
        const comments = await prisma.comment.findMany({
          where: {
            content: { contains: q, mode: "insensitive" },
          },
          take: limit,
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { username: true, name: true } },
            idea: { select: { title: true, id: true } },
            project: { select: { title: true, id: true } },
          },
        })
        return comments.map((c) => ({
          id: c.id,
          type: "discussion" as const,
          title: c.content.slice(0, 80),
          subtitle: `${c.user.name} • ${c.idea?.title ?? c.project?.title ?? ""}`,
          href: c.idea
            ? `/${c.user.username}`
            : `/projects/${c.project?.id}`,
          badge: "Comment",
        }))
      })()
    )
  }

  const settled = await Promise.allSettled(queries)
  for (const s of settled) {
    if (s.status === "fulfilled") {
      results.push(...s.value)
    }
  }

  results.sort((a, b) => {
    const aExact = a.title.toLowerCase() === q.toLowerCase() ? 0 : 1
    const bExact = b.title.toLowerCase() === q.toLowerCase() ? 0 : 1
    if (aExact !== bExact) return aExact - bExact

    const aStarts = a.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1
    const bStarts = b.title.toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1
    if (aStarts !== bStarts) return aStarts - bStarts

    return 0
  })

  const sliced = results.slice(0, limit * 4)

  return NextResponse.json<SearchResponse>({ results: sliced, total: sliced.length })
}
