"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Newspaper, Youtube, Radio, Search, Globe, Calendar, ExternalLink, BookOpen, BarChart3, Tag, ChevronDown, Copy, Check } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { fetchDashboardStats, fetchArticles, defaultStats, type ArticleItem } from "@/lib/data";
import { usePolling } from "@/lib/usePolling";

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const categoryIcons: Record<string, string> = {
  Pendidikan: "📚", Teknologi: "💻", Ekonomi: "💰", Kesehatan: "🏥",
  Sosial: "👥", Lingkungan: "🌍", Politik: "🏛️",
};

const categoryColors: Record<string, string> = {
  Pendidikan: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  Teknologi: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
  Ekonomi: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
  Kesehatan: "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300",
  Sosial: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  Lingkungan: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300",
  Politik: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
};

function citationText(art: ArticleItem) {
  return `${art.title}. (${new Date(art.publishedAt).getFullYear()}). ${art.category}. Retrieved from ${art.url}`;
}

/* ─── Page ──────────────────────────────────────── */

export default function IntelPublicPage() {
  const [stats, setStats] = useState(defaultStats);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [articleTotal, setArticleTotal] = useState(0);
  const [articleOffset, setArticleOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3600);
  const lastRefresh = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastRefresh.current) / 1000);
      setCountdown(Math.max(0, 3600 - elapsed));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const refreshStats = useCallback(() => {
    fetchDashboardStats().then((s) => { setStats(s); lastRefresh.current = Date.now(); setCountdown(3600); });
  }, []);

  const refreshArticles = useCallback(() => {
    const params: any = { limit: 12, offset: 0 };
    if (filterLang !== "all") params.lang = filterLang;
    if (filterCountry !== "all") params.country = filterCountry;
    if (filterCategory) params.category = filterCategory;
    if (searchQuery) params.keyword = searchQuery;
    fetchArticles(params).then((res) => { setArticles(res.items); setArticleTotal(res.total); setArticleOffset(12); });
  }, [filterCategory, filterLang, filterCountry, searchQuery]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const params: any = { limit: 12, offset: articleOffset };
    if (filterLang !== "all") params.lang = filterLang;
    if (filterCountry !== "all") params.country = filterCountry;
    if (filterCategory) params.category = filterCategory;
    if (searchQuery) params.keyword = searchQuery;
    fetchArticles(params).then((res) => {
      setArticles((prev) => [...prev, ...res.items]);
      setArticleTotal(res.total);
      setArticleOffset((prev) => prev + 12);
      setLoadingMore(false);
    });
  }, [filterCategory, filterLang, filterCountry, searchQuery, articleOffset]);

  useEffect(() => { refreshStats(); }, [refreshStats]);
  useEffect(() => { refreshArticles(); }, [refreshArticles]);
  usePolling(refreshStats, 3_600_000);

  const sortedCats = [...stats.categories].sort((a, b) => b.count - a.count);
  const maxCatCount = Math.max(...sortedCats.map((c) => c.count), 1);

  const copyCitation = async (art: ArticleItem) => {
    try {
      await navigator.clipboard.writeText(citationText(art));
      setCopiedId(art.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div className="section-padding container-main">
      {/* ── Header ── */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-text md:text-3xl">
          Data Intelligence
        </h1>
        <p className="mx-auto mt-1 max-w-2xl text-xs text-muted">
          Research database for academic journals, papers, and data analysis —
          aggregated from trusted sources across Indonesia.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.totalArticles.toLocaleString(), icon: Newspaper, color: "text-blue-500" },
          { label: "Total Videos", value: stats.totalVideos.toLocaleString(), icon: Youtube, color: "text-red-500" },
          { label: "Active Sources", value: stats.activeSources.toLocaleString(), icon: Radio, color: "text-emerald-500" },
          { label: "Categories", value: sortedCats.length.toLocaleString(), icon: BarChart3, color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface/5 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <span className="text-[9px] text-muted">{stat.label}</span>
            </div>
            <p className="mt-2 font-semibold text-xl md:text-2xl text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface/5 px-3 py-2 transition-colors focus-within:border-primary">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by keyword..."
            className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-muted/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-border bg-surface/5 px-3 py-2 text-[11px] text-text outline-none"
          >
            <option value="">All Categories</option>
            {sortedCats.map((c) => (
              <option key={c.name} value={c.name}>{categoryIcons[c.name] || "📄"} {c.name}</option>
            ))}
          </select>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="rounded-lg border border-border bg-surface/5 px-3 py-2 text-[11px] text-text outline-none"
          >
            <option value="all">All Languages</option>
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="rounded-lg border border-border bg-surface/5 px-3 py-2 text-[11px] text-text outline-none"
          >
            <option value="all">All Countries</option>
            <option value="id">Indonesia</option>
            <option value="us">United States</option>
          </select>
        </div>
      </div>

      {/* ── Category Quick Filters ── */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterCategory("")}
          className={cn(
            "rounded-lg border px-2.5 py-1 text-[10px] transition-colors",
            filterCategory === ""
              ? "border-primary bg-primary/10 font-medium text-primary"
              : "border-border text-muted hover:border-primary/30 hover:text-text",
          )}
        >
          All
        </button>
        {sortedCats.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setFilterCategory(cat.name === filterCategory ? "" : cat.name)}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-[10px] transition-colors",
              filterCategory === cat.name
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-border text-muted hover:border-primary/30 hover:text-text",
            )}
          >
            {categoryIcons[cat.name] || "📄"} {cat.name}
            <span className="ml-1 text-muted/60">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* ── Results Meta ── */}
      <div className="mt-6 flex items-center justify-between border-b border-border pb-2">
        <p className="text-[11px] text-muted">
          {articleTotal > 0
            ? `Showing ${articles.length} of ${articleTotal} articles`
            : "No articles found"}
        </p>
        <div className="flex items-center gap-1 text-[9px] text-muted">
          <Calendar className="h-3 w-3" />
          {countdown > 0
            ? `Next refresh in ${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
            : "Refreshing..."}
        </div>
      </div>

      {/* ── Article List ── */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {articles.length > 0 ? articles.map((art) => (
          <div
            key={art.id}
            className="group relative rounded-lg border border-border bg-surface/5 transition-all hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
          >
            <div className="flex gap-3 p-3">
              {art.image && (
                <img
                  src={art.image}
                  alt=""
                  className="mt-0.5 h-14 w-20 flex-shrink-0 rounded object-cover md:h-16 md:w-24"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                  <span className={cn("rounded border px-1.5 py-0.5 font-medium", categoryColors[art.category] || "border-border text-muted")}>
                    {categoryIcons[art.category] || "📄"} {art.category}
                  </span>
                  <span className="text-muted">{art.language?.toUpperCase()}</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{formatDate(art.publishedAt)}</span>
                </div>
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block"
                >
                  <h3 className="line-clamp-2 text-sm font-medium text-text transition-colors group-hover:text-primary">
                    {art.title}
                  </h3>
                </a>
                {art.description && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{stripHtml(art.description)}</p>
                )}
                <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[9px] font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open Source
                  </a>
                  <button
                    onClick={() => copyCitation(art)}
                    className="inline-flex items-center gap-1 rounded bg-surface px-2 py-1 text-[9px] text-muted transition-colors hover:text-text"
                  >
                    {copiedId === art.id ? (
                      <><Check className="h-3 w-3 text-emerald-500" /> Copied</>
                    ) : (
                      <><Copy className="h-3 w-3" /> Cite</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-border" />
            <p className="mt-2 text-xs text-muted">No articles match your filters.</p>
            <p className="text-[10px] text-muted">Try adjusting search terms or clearing filters.</p>
          </div>
        )}
      </div>

      {/* ── Load More ── */}
      {articleOffset < articleTotal && articles.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/5 px-5 py-2 text-xs text-text transition-colors hover:bg-surface/10 disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : `Load More (${articleOffset - 12}–${Math.min(articleOffset - 12 + 12, articleTotal)} of ${articleTotal})`}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* ── Category Distribution ── */}
      <div className="mt-10 rounded-lg border border-border bg-surface/5 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-text">Category Distribution</h2>
        </div>
        <div className="space-y-2.5">
          {sortedCats.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text">{categoryIcons[cat.name] || "📄"} {cat.name}</span>
                <span className="text-muted">{cat.count.toLocaleString()} articles</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-border/40">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all"
                  style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── YouTube ── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-500" />
          <h2 className="text-base font-bold text-text">Video References</h2>
          <span className="rounded-full bg-surface/40 px-2 py-0.5 text-[10px] text-muted">{stats.totalVideos}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {stats.recentVideos.slice(0, 4).map((v) => (
            <Link
              key={v.id}
              href={`/intelligence/video/${v.id}`}
              className="flex items-start gap-2 rounded-lg border border-border bg-surface/5 px-3 py-2.5 transition-colors hover:bg-surface/10"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-500/10">
                <Youtube className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[11px] font-medium text-text">{v.title}</p>
                <p className="mt-0.5 text-[9px] text-muted">{v.channel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-12 mb-8 rounded-lg border border-border bg-surface/5 p-6 text-center">
        <h2 className="text-base font-bold text-text">
          Need More Research Tools?
        </h2>
        <p className="mx-auto mt-1 max-w-lg text-xs text-muted">
          Access advanced analytics, keyword tracking, sentiment analysis, and
          research exports from the full Data Intelligence Command Center.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link href="/login">
            <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90">
              Login to Dashboard
            </button>
          </Link>
          <Link href="/register">
            <button className="rounded-lg border border-border bg-surface/5 px-4 py-2 text-xs font-medium text-text transition-colors hover:bg-surface/10">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
