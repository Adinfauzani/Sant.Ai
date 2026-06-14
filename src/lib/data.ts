const BASE = typeof window !== "undefined" ? window.location.origin : "";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${path}`);
  return res.json();
}

export interface DashboardStats {
  totalArticles: number;
  totalVideos: number;
  activeSources: number;
  totalKeywords: number;
  categories: { name: string; count: number }[];
  recentArticles: { id: string; title: string; source: string; category: string; date: string }[];
  recentVideos: { id: string; title: string; channel: string; category: string; views: number; date: string }[];
}

export const defaultStats: DashboardStats = {
  totalArticles: 0,
  totalVideos: 0,
  activeSources: 0,
  totalKeywords: 0,
  categories: [],
  recentArticles: [],
  recentVideos: [],
};

export function fetchDashboardStats(): Promise<DashboardStats> {
  return fetcher<DashboardStats>("/api/data/stats").catch(() => defaultStats);
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  category: string;
  sentiment: string;
  sourceId: string;
  language: string;
  country: string;
  publishedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export function fetchArticles(params?: {
  category?: string;
  keyword?: string;
  source?: string;
  lang?: string;
  country?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<ArticleItem>> {
  const search = new URLSearchParams();
  if (params?.category && params.category !== "all") search.set("category", params.category);
  if (params?.keyword) search.set("keyword", params.keyword);
  if (params?.source && params.source !== "all") search.set("source", params.source);
  if (params?.lang && params.lang !== "all") search.set("lang", params.lang);
  if (params?.country && params.country !== "all") search.set("country", params.country);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  return fetcher<PaginatedResponse<ArticleItem>>(`/api/data/articles?${search}`).catch(() => ({ items: [], total: 0, limit: 0, offset: 0 }));
}

export interface YouTubeItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  thumbnail: string;
  views: number;
  category: string;
  language: string;
  country: string;
  publishedAt: string;
}

export function fetchYouTube(params?: {
  category?: string;
  language?: string;
  country?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<YouTubeItem>> {
  const search = new URLSearchParams();
  if (params?.category && params.category !== "all") search.set("category", params.category);
  if (params?.language) search.set("lang", params.language);
  if (params?.country) search.set("country", params.country);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  return fetcher<PaginatedResponse<YouTubeItem>>(`/api/data/youtube?${search}`).catch(() => ({ items: [], total: 0, limit: 0, offset: 0 }));
}

export interface SourceItem { id: string; name: string; type: string; url: string; rssUrl: string; status: string; }
export function fetchSources(): Promise<{ items: SourceItem[] }> {
  return fetcher<{ items: SourceItem[] }>("/api/data/sources").catch(() => ({ items: [] }));
}

export interface KeywordItem { id: string; keyword: string; category: string; active: boolean; }
export function fetchKeywords(): Promise<{ items: KeywordItem[] }> {
  return fetcher<{ items: KeywordItem[] }>("/api/data/keywords").catch(() => ({ items: [] }));
}
