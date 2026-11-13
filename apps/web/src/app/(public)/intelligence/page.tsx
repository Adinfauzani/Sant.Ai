"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Newspaper, Youtube, Radio, Search, Globe, Calendar, ExternalLink, BookOpen,
  BarChart3, Tag, ChevronDown, Copy, Check,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { fetchDashboardStats, fetchArticles, defaultStats, type ArticleItem } from "@/lib/data/data";
import { usePolling } from "@/hooks/usePolling";
import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";
import { Button } from "@santai/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group";
import { TwinOrbit } from "@santai/ui/twinOrbit";

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const categoryIcons: Record<string, string> = {
  Pendidikan: "📚", Teknologi: "💻", Ekonomi: "💰", Kesehatan: "🏥",
  Sosial: "👥", Lingkungan: "🌍", Politik: "🏛️",
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
    fetchDashboardStats().then((s) => {
      setStats(s);
      lastRefresh.current = Date.now();
      setCountdown(3600);
    });
  }, []);

  const refreshArticles = useCallback(() => {
    const params: any = { limit: 12, offset: 0 };
    if (filterLang !== "all") params.lang = filterLang;
    if (filterCountry !== "all") params.country = filterCountry;
    if (filterCategory) params.category = filterCategory;
    if (searchQuery) params.keyword = searchQuery;
    fetchArticles(params).then((res) => {
      setArticles(res.items);
      setArticleTotal(res.total);
      setArticleOffset(12);
    });
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

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);
  useEffect(() => {
    refreshArticles();
  }, [refreshArticles]);
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

  const selectClass =
    "h-8 rounded-md border border-border bg-card px-2.5 text-[11px] text-text outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="section-padding container-main">
          {/* ── Header ── */}
          <div className="mb-6 text-center">
            <p className="mb-1 editorial-label">Data Intelligence</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-text md:text-3xl">
              Riset &amp; Data Intelligence
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted">
              Basis data riset untuk jurnal akademik, makalah, dan analisis data yang dihimpun dari
              sumber tepercaya di Indonesia.
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Artikel", value: stats.totalArticles.toLocaleString(), icon: Newspaper },
              { label: "Total Video", value: stats.totalVideos.toLocaleString(), icon: Youtube },
              { label: "Sumber Aktif", value: stats.activeSources.toLocaleString(), icon: Radio },
              { label: "Kategori", value: sortedCats.length.toLocaleString(), icon: BarChart3 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="size-4 text-primary" />
                  <span className="text-[9px] text-muted">{stat.label}</span>
                </div>
                <p className="mt-2 font-semibold text-xl text-text md:text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ── Search & Filters ── */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <InputGroup className="flex-1 rounded-lg">
              <InputGroupAddon>
                <Search className="size-4 text-muted" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel berdasarkan kata kunci..."
                aria-label="Cari artikel"
              />
            </InputGroup>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter kategori"
                className={selectClass}
              >
                <option value="">Semua Kategori</option>
                {sortedCats.map((c) => (
                  <option key={c.name} value={c.name}>
                    {categoryIcons[c.name] || "📄"} {c.name}
                  </option>
                ))}
              </select>
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                aria-label="Filter bahasa"
                className={selectClass}
              >
                <option value="all">Semua Bahasa</option>
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                aria-label="Filter negara"
                className={selectClass}
              >
                <option value="all">Semua Negara</option>
                <option value="id">Indonesia</option>
                <option value="us">United States</option>
              </select>
            </div>
          </div>

          {/* ── Category Quick Filters ── */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              aria-pressed={filterCategory === ""}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filterCategory === ""
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border text-muted hover:border-border-strong hover:text-text",
              )}
            >
              Semua
            </button>
            {sortedCats.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setFilterCategory(cat.name === filterCategory ? "" : cat.name)}
                aria-pressed={filterCategory === cat.name}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  filterCategory === cat.name
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-border text-muted hover:border-border-strong hover:text-text",
                )}
              >
                {categoryIcons[cat.name] || "📄"} {cat.name}
                <span className="ml-1 text-muted">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* ── Results Meta ── */}
          <div className="mt-6 flex items-center justify-between border-b border-border pb-2">
            <p className="text-[11px] text-muted">
              {articleTotal > 0
                ? `Menampilkan ${articles.length} dari ${articleTotal} artikel`
                : "Belum ada artikel ditemukan"}
            </p>
            <div className="flex items-center gap-1 text-[9px] text-muted">
              <Calendar className="size-3" />
              {countdown > 0
                ? `Refresh berikutnya dalam ${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
                : "Sedang refresh..."}
            </div>
          </div>

          {/* ── Article List ── */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {articles.length > 0 ? (
              articles.map((art) => (
                <div
                  key={art.id}
                  className="group relative rounded-lg border border-border bg-card transition-colors duration-150 hover:border-border-strong"
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
                        <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-medium text-muted">
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
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">
                          {stripHtml(art.description)}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[9px] font-medium text-text transition-colors hover:border-border-strong hover:text-primary"
                        >
                          <ExternalLink className="size-3" />
                          Buka sumber
                        </a>
                        <button
                          type="button"
                          onClick={() => copyCitation(art)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[9px] text-muted transition-colors hover:border-border-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {copiedId === art.id ? (
                            <>
                              <Check className="size-3 text-success" />
                              Tersalin
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              Sitasi
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
                <Newspaper className="mx-auto size-8 text-border-strong" />
                <p className="mt-2 text-xs text-muted">Tidak ada artikel yang cocok dengan filter.</p>
                <p className="mt-1 text-[10px] text-muted">
                  Coba ubah kata kunci atau kosongkan filternya.
                </p>
              </div>
            )}
          </div>

          {/* ── Load More ── */}
          {articleOffset < articleTotal && articles.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
                className="gap-1.5"
              >
                {loadingMore ? (
                  <>
                    <TwinOrbit className="size-3.5" />
                    Memuat...
                  </>
                ) : (
                  <>
                    Muat lagi ({articleOffset - 12}–{Math.min(articleOffset - 12 + 12, articleTotal)} dari{" "}
                    {articleTotal})
                    <ChevronDown className="size-3" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* ── Category Distribution ── */}
          <div className="mt-10 rounded-lg border border-border bg-card p-4 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              <h2 className="font-heading text-sm font-bold text-text">Sebaran Kategori</h2>
            </div>
            <div className="space-y-2.5">
              {sortedCats.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text">
                      {categoryIcons[cat.name] || "📄"} {cat.name}
                    </span>
                    <span className="text-muted">{cat.count.toLocaleString()} artikel</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-border">
                    <div
                      className="h-2 rounded-full bg-primary"
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
              <Youtube className="size-4 text-primary" />
              <h2 className="font-heading text-base font-bold text-text">Referensi Video</h2>
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-muted">
                {stats.totalVideos}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {stats.recentVideos.slice(0, 4).map((v) => (
                <Link
                  key={v.id}
                  href={`/intelligence/video/${v.id}`}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors duration-150 hover:border-border-strong"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Youtube className="size-4 text-primary" />
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
          <div className="mt-12 mb-8 rounded-lg border border-border bg-card p-6 text-center">
            <h2 className="font-heading text-base font-bold text-text">
              Butuh alat riset yang lebih lengkap?
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-xs text-muted">
              Akses analitik lanjutan, pelacakan kata kunci, analisis sentimen, dan ekspor riset lewat
              Data Intelligence Command Center.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button size="sm" asChild>
                <Link href="/login">Masuk ke Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
