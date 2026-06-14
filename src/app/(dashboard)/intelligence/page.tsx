"use client";

import { useState, useEffect, useCallback } from "react";
import { Newspaper, Youtube, Radio, Hash, ArrowRight, TrendingUp, Shield, BookOpen, Globe, Languages, Play, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchDashboardStats, fetchArticles, fetchYouTube, defaultStats, type ArticleItem, type YouTubeItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/* ─── Section Card ───────────────────────────────── */

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-gradient-to-br from-surface/30 to-surface/10 p-5", className)}>
      <h3 className="mb-4 text-sm font-semibold text-text">{title}</h3>
      {children}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */

export default function IntelPublicPage() {
  const [stats, setStats] = useState(defaultStats);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [securityArticles, setSecurityArticles] = useState<ArticleItem[]>([]);
  const [recentNews, setRecentNews] = useState<ArticleItem[]>([]);
  const [allArticles, setAllArticles] = useState<ArticleItem[]>([]);
  const [articleTotal, setArticleTotal] = useState(0);
  const [articleOffset, setArticleOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [filterLang, setFilterLang] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [fetching, setFetching] = useState(false);

  const refresh = useCallback(() => {
    fetchDashboardStats().then(setStats);
    fetchArticles({ limit: 5, category: "Literasi Digital" }).then((res) => setArticles(res.items));
    fetchYouTube({ limit: 5, category: "Literasi Digital" }).then((res) => setVideos(res.items));
    fetchArticles({ limit: 5, category: "Keamanan Digital" }).then((res) => setSecurityArticles(res.items));
    fetchArticles({ limit: 5 }).then((res) => setRecentNews(res.items));
  }, []);

  const triggerFetch = useCallback(async () => {
    setFetching(true);
    try {
      await fetch("/api/cron/fetch-all");
    } catch {}
    await refresh();
    setFetching(false);
  }, [refresh]);

  const refreshAll = useCallback(() => {
    const params: any = { limit: 10, offset: 0 };
    if (filterLang !== "all") params.lang = filterLang;
    if (filterCountry !== "all") params.country = filterCountry;
    if (searchQuery) params.keyword = searchQuery;
    fetchArticles(params).then((res) => { setAllArticles(res.items); setArticleTotal(res.total); setArticleOffset(10); });
  }, [filterLang, filterCountry, searchQuery]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const params: any = { limit: 10, offset: articleOffset };
    if (filterLang !== "all") params.lang = filterLang;
    if (filterCountry !== "all") params.country = filterCountry;
    if (searchQuery) params.keyword = searchQuery;
    fetchArticles(params).then((res) => { setAllArticles((prev) => [...prev, ...res.items]); setArticleOffset((prev) => prev + 10); setLoadingMore(false); });
  }, [filterLang, filterCountry, searchQuery, articleOffset]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { refreshAll(); }, [refreshAll]);
  usePolling(refresh, 3_600_000); // 1 jam

  const categories = [
    { name: "Pendidikan", count: stats.categories.find((c) => c.name === "Pendidikan")?.count || 0, icon: "📚" },
    { name: "Teknologi", count: stats.categories.find((c) => c.name === "Teknologi")?.count || 0, icon: "💻" },
    { name: "Ekonomi", count: stats.categories.find((c) => c.name === "Ekonomi")?.count || 0, icon: "💰" },
    { name: "Kesehatan", count: stats.categories.find((c) => c.name === "Kesehatan")?.count || 0, icon: "🏥" },
    { name: "Sosial", count: stats.categories.find((c) => c.name === "Sosial")?.count || 0, icon: "👥" },
    { name: "Lingkungan", count: stats.categories.find((c) => c.name === "Lingkungan")?.count || 0, icon: "🌍" },
    { name: "Politik", count: stats.categories.find((c) => c.name === "Politik")?.count || 0, icon: "🏛️" },
  ].sort((a, b) => b.count - a.count);

  const latestNews = stats.recentArticles.slice(0, 4);
  const latestVids = stats.recentVideos.slice(0, 4);

  return (
    <div className="section-padding container-main">
      {/* ── Header ── */}
      <div className="py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-white shadow-lg shadow-primary/20">
          S
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold text-text md:text-4xl">
          Data Intelligence
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted">
          Real-time monitoring and analytics platform for digital trends, public issues,
          and information patterns across Indonesia.
        </p>
      </div>

      {/* ── Overview Stats ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.totalArticles.toLocaleString(), icon: Newspaper, color: "text-blue-500" },
          { label: "Total Videos", value: stats.totalVideos.toLocaleString(), icon: Youtube, color: "text-red-500" },
          { label: "Active Sources", value: stats.activeSources.toLocaleString(), icon: Radio, color: "text-emerald-500" },
          { label: "Top Categories", value: String(stats.categories.length || "0"), icon: Hash, color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="group rounded-2xl border border-border bg-gradient-to-br from-surface/50 to-surface/30 p-4 transition-all hover:border-primary/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <p className="mt-3 font-heading text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-[10px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Literasi Digital ── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-text">Literasi Digital</h2>
          </div>
          <button
            onClick={triggerFetch}
            disabled={fetching}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5 text-[10px] text-muted transition-all hover:border-primary/30 hover:text-text disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", fetching && "animate-spin")} />
            {fetching ? "Fetching..." : "Fetch Now"}
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Top Categories">
            <div className="space-y-2">
              {categories.slice(0, 5).map((c, i) => (
                <div key={c.name} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[9px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs text-text">{c.icon} {c.name}</span>
                  </div>
                  <span className="text-[9px] text-muted">{c.count} articles</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Latest News">
            <div className="space-y-2">
              {articles.length > 0 ? articles.map((n) => (
                <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-xl bg-surface/20 px-3 py-2 transition-colors hover:bg-surface/40">
                  <div className="flex gap-2">
                    {n.image && <img src={n.image} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-text hover:text-primary">{n.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                        <Newspaper className="h-2.5 w-2.5" />{n.category}
                      </p>
                    </div>
                  </div>
                </a>
              )) : (
                <p className="py-4 text-center text-[10px] text-muted">No articles yet</p>
              )}
            </div>
          </SectionCard>

        </div>
      </div>

      {/* ── Keamanan Digital ── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-text">Keamanan Digital</h2>
          </div>
          <button
            onClick={triggerFetch}
            disabled={fetching}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5 text-[10px] text-muted transition-all hover:border-primary/30 hover:text-text disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", fetching && "animate-spin")} />
            {fetching ? "Fetching..." : "Fetch Now"}
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Security Topics">
            <div className="space-y-2">
              {(stats.categories.length > 0 ? stats.categories : [{ name: "No data yet", count: 0 }]).slice(0, 5).map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2">
                  <span className="text-xs font-medium text-text">{t.name}</span>
                  <span className="text-[9px] text-muted">{t.count.toLocaleString()} articles</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Latest Security News">
            <div className="space-y-2">
              {securityArticles.length > 0 ? securityArticles.map((n) => (
                <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-xl bg-surface/20 px-3 py-2 transition-colors hover:bg-surface/40">
                  <div className="flex gap-2">
                    {n.image && <img src={n.image} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-text hover:text-primary">{n.title}</p>
                      <p className="mt-0.5 text-[9px] text-muted">{n.category}</p>
                    </div>
                  </div>
                </a>
              )) : (
                <p className="py-4 text-center text-[10px] text-muted">No security articles yet</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Security Videos">
            <div className="space-y-2">
              {videos.length > 0 ? videos.map((v) => (
                <Link key={v.title} href={`/intelligence/video/${v.id}`}
                  className="block w-full rounded-xl bg-surface/20 px-3 py-2 transition-colors hover:bg-surface/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <Play className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium text-text">{v.title}</p>
                      <p className="text-[9px] text-muted">{v.channelName} · {v.views.toLocaleString()} views</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="py-4 text-center text-[10px] text-muted">No videos yet</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Isu Publik Indonesia ── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-text">Isu Publik Indonesia</h2>
          </div>
          <button
            onClick={triggerFetch}
            disabled={fetching}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5 text-[10px] text-muted transition-all hover:border-primary/30 hover:text-text disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", fetching && "animate-spin")} />
            {fetching ? "Fetching..." : "Fetch Now"}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all",
                activeCategory === i
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:text-text",
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Category Distribution">
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2">
                  <span className="text-xs font-medium text-text">{cat.icon} {cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${categories[0]?.count ? (cat.count / categories[0].count) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent News">
            <div className="space-y-2">
              {recentNews.length > 0 ? recentNews.map((n) => (
                <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl bg-surface/20 px-3 py-2.5 transition-colors hover:bg-surface/40">
                  {n.image && (
                    <img src={n.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-text hover:text-primary">{n.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-[9px] text-muted">
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">{n.category}</span>
                      <span>{new Date(n.publishedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </a>
              )) : (
                <p className="py-4 text-center text-[10px] text-muted">No news yet. Data will appear once GNews API fetcher runs.</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── All Articles — History ── */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl font-bold text-text">All Articles</h2>
            <span className="rounded-full bg-surface/40 px-2 py-0.5 text-[10px] text-muted">{articleTotal}</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5">
            <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-32 bg-transparent text-[10px] text-text outline-none placeholder:text-muted/50 md:w-40"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5">
              <Languages className="h-3.5 w-3.5 text-muted" />
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                className="bg-transparent text-[10px] text-text outline-none"
              >
                <option value="all">All Languages</option>
                <option value="id">🇮🇩 Indonesia</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/20 px-3 py-1.5">
              <Globe className="h-3.5 w-3.5 text-muted" />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-transparent text-[10px] text-text outline-none"
              >
                <option value="all">All Countries</option>
                <option value="id">🇮🇩 Indonesia</option>
                <option value="us">🇺🇸 United States</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {allArticles.length > 0 ? allArticles.map((art) => (
            <a key={art.id} href={art.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-xl border border-transparent bg-surface/10 px-4 py-3 transition-all hover:border-border hover:bg-surface/30">
              {art.image && (
                <img src={art.image} alt="" className="mt-0.5 h-14 w-20 flex-shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">{art.category}</span>
                  <span className="rounded-full bg-surface/30 px-2 py-0.5 text-[9px] text-muted">{art.language?.toUpperCase()}</span>
                  <span className="text-[9px] text-muted">·</span>
                  <span className="text-[9px] text-muted">{new Date(art.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-text hover:text-primary">{art.title}</p>
                {art.description && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{stripHtml(art.description)}</p>
                )}
              </div>
              <div className="hidden flex-shrink-0 items-center gap-1.5 sm:flex">
                <span className="text-[10px] text-muted">{art.country?.toUpperCase()}</span>
                <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
            </a>
          )) : (
            <p className="py-8 text-center text-[10px] text-muted">No articles yet. Data appears after GNews fetcher runs.</p>
          )}
        </div>

        {articleOffset < articleTotal && allArticles.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-xl border border-border bg-surface/20 px-6 py-2.5 text-xs font-medium text-text transition-all hover:border-primary/30 hover:bg-surface/40 disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : `Load More (${articleOffset}/${articleTotal})`}
            </button>
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="mt-12 mb-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center">
        <h2 className="font-heading text-xl font-bold text-text">
          Unlock Advanced Analytics
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-xs text-muted">
          Sign in to access the full Data Intelligence Command Center with advanced
          analytics, real-time monitoring, keyword tracking, and research tools.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button className="gap-2">
              Login <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
