"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Users,
  FolderKanban,
  Lightbulb,
  Newspaper,
  Video,
  MessageSquare,
  Clock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type SearchHit } from "@/lib/data/search"
import { Avatar, AvatarFallback, AvatarImage } from "@santai/ui/avatar"
import { Badge } from "@santai/ui/badge"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group"
import { TwinOrbit } from "@santai/ui/twinOrbit"

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
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded-sm bg-primary/20 text-primary font-medium">{part}</mark>
      : part
  )
}

export function SearchDropdown({
  placeholder = "Search...",
}: {
  placeholder?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<RecentSearch[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  const allResults = results
  const groupOrder = ["user", "project", "idea", "article", "video", "discussion"]

  const groupedResults = allResults.reduce<
    Record<string, { label: string; hits: SearchHit[] }>
  >((acc, hit) => {
    const type = hit.type
    if (!acc[type]) {
      acc[type] = { label: TYPE_LABELS[type] ?? type, hits: [] }
    }
    acc[type].hits.push(hit)
    return acc
  }, {})

  const flatResults = groupOrder.flatMap((type) => {
    const group = groupedResults[type]
    return group ? group.hits : []
  })

  const mountedRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: q.trim(), filter: "all" })
      const res = await fetch(`/api/search?${params}`, { signal: abortRef.current.signal })
      if (!mountedRef.current) return
      const data = await res.json()
      if (mountedRef.current) setResults(data.results ?? [])
    } catch (err) {
      if (!mountedRef.current || (err instanceof DOMException && err.name === "AbortError")) return
      if (mountedRef.current) setResults([])
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    debounceRef.current = setTimeout(() => fetchResults(query), 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, fetchResults])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFocus = () => {
    setRecent(getRecent())
    setOpen(true)
    setSelectedIndex(-1)
  }

  const handleSelect = (hit: SearchHit) => {
    addRecent(query.trim())
    setOpen(false)
    setQuery("")
    router.push(hit.href)
  }

  const handleSubmit = () => {
    if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
      handleSelect(flatResults[selectedIndex])
      return
    }
    const q = query.trim()
    if (q) {
      addRecent(q)
      setOpen(false)
      setQuery("")
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, -1))
        break
      case "Enter":
        e.preventDefault()
        handleSubmit()
        break
      case "Escape":
        setOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const showDropdown = open && (query.trim() ? flatResults.length > 0 || loading : recent.length > 0)

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-muted" />
          </InputGroupAddon>
        </InputGroup>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
          {/* Recent searches */}
          {!query.trim() && recent.length > 0 && (
            <div className="p-2">
              <div className="mb-1 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted">
                <Clock className="size-3" />
                Recent
              </div>
              {recent.slice(0, 5).map((r) => (
                <button
                  key={r.q}
                  onClick={() => {
                    setQuery(r.q)
                    fetchResults(r.q)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Clock className="size-3.5 shrink-0 text-muted/50" />
                  <span className="truncate">{r.q}</span>
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && query.trim() && (
            <div className="flex items-center justify-center gap-2 px-3 py-8">
              <TwinOrbit className="size-4 text-muted" />
              <span className="text-xs text-muted">Mencari...</span>
            </div>
          )}

          {/* Results */}
          {!loading && query.trim() && flatResults.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto p-1.5">
              {groupOrder.map((type) => {
                const group = groupedResults[type]
                if (!group) return null
                return (
                  <div key={type}>
                    <div className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted/50">
                      {group.label}
                    </div>
                    {group.hits.map((hit) => {
                      const Icon = TYPE_ICONS[hit.type]
                      const idx = flatResults.indexOf(hit)
                      return (
                        <button
                          key={hit.id}
                          onClick={() => handleSelect(hit)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                            idx === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "text-text hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {hit.image ? (
                            <Avatar className="size-8 shrink-0 rounded-md">
                              <AvatarImage src={hit.image} alt={hit.title} />
                              <AvatarFallback className="rounded-md text-xs">
                                {hit.title.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                              {Icon && <Icon className="size-[18px]" />}
                            </div>
                          )}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {renderHighlighted(hit.title, query)}
                            </span>
                            <span className="truncate text-xs text-muted">
                              {renderHighlighted(hit.subtitle, query)}
                            </span>
                          </div>
                          {hit.badge && (
                            <Badge variant="secondary" className="shrink-0 text-[10px] font-medium">
                              {hit.badge}
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty */}
          {!loading && query.trim() && flatResults.length === 0 && (
            <div className="flex flex-col items-center py-6 text-center">
              <Search className="mb-2 size-6 text-muted/30" />
              <p className="text-sm text-muted">No results found</p>
            </div>
          )}

          {/* Footer */}
          {query.trim() && (
            <div className="border-t border-border px-2 py-1.5">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => { setOpen(false); addRecent(query.trim()) }}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:text-accent-foreground"
              >
                <ArrowRight className="size-3" />
                See all results
                {flatResults.length > 0 && ` (${allResults.length})`}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
