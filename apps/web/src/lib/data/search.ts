export type SearchCategory =
  | "all"
  | "users"
  | "communities"
  | "projects"
  | "events"
  | "articles"
  | "ideas"
  | "discussions"
  | "videos"

export interface SearchHit {
  id: string
  type: "user" | "community" | "project" | "event" | "article" | "idea" | "video" | "discussion"
  title: string
  subtitle: string
  image?: string
  href: string
  badge?: string
}

export interface SearchResponse {
  results: SearchHit[]
  total: number
}

export interface SearchQuery {
  q: string
  filter?: SearchCategory
  page?: number
}

export const SEARCH_CATEGORIES: { value: SearchCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "users", label: "Users" },
  { value: "communities", label: "Communities" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "articles", label: "Articles" },
  { value: "ideas", label: "Ideas" },
  { value: "discussions", label: "Discussions" },
  { value: "videos", label: "Videos" },
]

export function highlightMatch(text: string, query: string): string {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  return text.replace(regex, "####HIGHLIGHT:$1####ENDHL####")
}
