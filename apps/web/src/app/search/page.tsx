"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import {
  Search,
  Users,
  FolderKanban,
  Lightbulb,
  Newspaper,
  Video,
  MessageSquare,
  ArrowLeft,
  Clock,
  TrendingUp,
  type LucideIcon,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type SearchHit, type SearchCategory, SEARCH_CATEGORIES } from "@/lib/search"
import { Avatar, AvatarFallback, AvatarImage } from "@santai/ui/avatar"
import { Badge } from "@santai/ui/badge"
import { Skeleton } from "@santai/ui/skeleton"

const RECENT_KEY = "sant-ai:recent-searches"
const MAX_RECENT = 8

interface RecentSearch {
  q: string
  timestamp: number
}

function getRecent(): RecentSearch[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")
  } catch {
    return []
  }
}

function addRecent(q: string) {
  const list = getRecent().filter((r) => r.q !== q)
  list.unshift({ q, timestamp: Date.now() })
  if (list.length > MAX_RECENT) list.length = MAX_RECENT
  localStorage.setItem(RECENT_KEY, JSON.stringify(list))
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY)
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  user: Users,
  project: FolderKanban,
  idea: Lightbulb,
  article: Newspaper,
  video: Video,
  discussion: MessageSquare,
}

const TYPE_LABELS: Record<string, string> = {
  user: "Users",
  project: "Projects",
  idea: "Ideas",
  article: "Articles",
  video: "Videos",
  discussion: "Discussions",
}

function renderHighlighted(text: string, query: string) {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="rounded-sm bg-primary/20 text-primary font-medium">{part}</mark>
      : part
  )
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const [inputValue, setInputValue] = useState(query)
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<SearchCategory>("all")
  const [recent, setRecent] = useState<RecentSearch[]>([])
  const [showRecent, setShowRecent] = useState(true)

  useEffect(() => {
    setRecent(getRecent())
  }, [])

  const fetchResults = useCallback(async (q: string, f: SearchCategory) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: q.trim(), filter: f })
      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query.trim()) {
      setInputValue(query)
      fetchResults(query, filter)
      addRecent(query.trim())
      setRecent(getRecent())
    }
  }, [query, filter, fetchResults])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const handleRecentClick = (q: string) => {
    setInputValue(q)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const groupedResults = results.reduce<
    Record<string, { label: string; hits: SearchHit[] }>
  >((acc, hit) => {
    const type = hit.type
    if (!acc[type]) {
      acc[type] = { label: TYPE_LABELS[type] ?? type, hits: [] }
    }
    acc[type].hits.push(hit)
    return acc
  }, {})

  const groupOrder = ["user", "project", "idea", "article", "video", "discussion"]
  const hasResults = Object.keys(groupedResults).length > 0

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-[18px]" />
        </Link>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search anything..."
              autoFocus
              className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Empty state: Recent / Trending */}
      {!query.trim() && recent.length > 0 && showRecent && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-4" />
              Recent Searches
            </div>
            <button
              onClick={clearRecent}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.q}
                onClick={() => handleRecentClick(r.q)}
                className="rounded-lg bg-accent/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {r.q}
              </button>
            ))}
          </div>
        </div>
      )}

      {!query.trim() && (
        <div className="flex flex-col items-center py-16 text-center">
          <Search className="mb-4 size-12 text-muted-foreground/20" />
          <h2 className="mb-1 text-lg font-semibold text-foreground">Search Sant.Ai</h2>
          <p className="text-sm text-muted-foreground">
            Find users, projects, ideas, articles, and more
          </p>
        </div>
      )}

      {/* Results */}
      {query.trim() && (
        <>
          {/* Filter tabs */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                  <Skeleton className="size-10 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty results */}
          {!loading && query.trim() && !hasResults && (
            <div className="flex flex-col items-center py-16 text-center">
              <Search className="mb-4 size-10 text-muted-foreground/20" />
              <p className="text-sm font-medium text-muted-foreground">No results found</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Try different keywords or filters
              </p>
            </div>
          )}

          {/* Grouped results */}
          {!loading && hasResults && (
            <div className="space-y-6">
              {groupOrder.map((type) => {
                const group = groupedResults[type]
                if (!group) return null
                return (
                  <section key={type}>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/50">
                      {group.label}
                    </h3>
                    <div className="space-y-1">
                      {group.hits.map((hit) => (
                        <Link
                          key={hit.id}
                          href={hit.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent"
                        >
                          {(() => {
                            const Icon = hit.image ? null : TYPE_ICONS[hit.type]
                            return hit.image ? (
                              <Avatar className="size-10 shrink-0 rounded-lg">
                                <AvatarImage src={hit.image} alt={hit.title} />
                                <AvatarFallback className="rounded-lg text-xs">
                                  {hit.title.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                {Icon && <Icon className="size-[18px]" />}
                              </div>
                            )
                          })()}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium text-foreground">
                              {renderHighlighted(hit.title, query)}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {renderHighlighted(hit.subtitle, query)}
                            </span>
                          </div>
                          {hit.badge && (
                            <Badge variant="secondary" className="shrink-0 text-[10px] font-medium">
                              {hit.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  </section>
                )
              })}

              {/* Summary */}
              <div className="border-t border-border pt-3 text-center text-xs text-muted-foreground/40">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}
