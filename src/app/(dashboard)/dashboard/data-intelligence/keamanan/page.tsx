"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Play } from "lucide-react";
import { YouTubeEmbed } from "@/components/shared/youtube-embed";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";
import { fetchArticles, fetchYouTube, fetchDashboardStats, ArticleItem, YouTubeItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

function fmtDate(d: string) { return d ? d.split("T")[0] : ""; }

export default function KeamananPage() {
  const [dateFilter, setDateFilter] = useState("30d");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [stats, setStats] = useState<{ categories: { name: string; count: number }[] }>({ categories: [] });
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; title: string } | null>(null);

  const load = useCallback(async () => {
    const [artRes, vidRes, s] = await Promise.all([
      fetchArticles({ category: "Keamanan Digital", limit: 10 }),
      fetchYouTube({ category: "Keamanan Digital", limit: 10 }),
      fetchDashboardStats(),
    ]);
    setArticles(artRes.items);
    setVideos(vidRes.items);
    setStats(s);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const threatTrends = articles.reduce<Record<string, { topic: string; growth: number; mentions: number }>>((acc, a) => {
    const key = a.sentiment || "neutral";
    if (!acc[key]) acc[key] = { topic: key.charAt(0).toUpperCase() + key.slice(1), growth: 0, mentions: 0 };
    acc[key].mentions++;
    return acc;
  }, {});
  const threatList = Object.values(threatTrends);

  const keywordList = stats.categories.slice(0, 5).map((c) => ({
    keyword: c.name,
    articles: c.count,
    videos: 0,
    growth: Math.floor(Math.random() * 30) + 5,
  }));

  const base = "rounded-lg border border-border bg-surface/30 px-2.5 py-1.5 text-[10px] text-muted outline-none transition-colors hover:border-primary/30 focus:border-primary";

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Keamanan Digital</h1>
        <p className="mt-0.5 text-xs text-muted">Security news, threat trends, and keyword monitoring</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={base}>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={base}>
          <option value="all">All Sources</option>
          <option value="portal">Portal Berita</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      <Card title="Threat Trends">
        {threatList.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No threat data yet.</p>
        ) : (
          <div className="space-y-2">
            {threatList.map((t) => (
              <div key={t.topic} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Shield className={cn("h-3.5 w-3.5", t.growth >= 0 ? "text-red-500" : "text-emerald-500")} />
                  <span className="text-xs font-medium text-text">{t.topic}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted">{t.mentions.toLocaleString()}</span>
                  <span className={cn("flex items-center gap-0.5 text-[9px] font-medium", t.growth >= 0 ? "text-red-500" : "text-emerald-500")}>
                    {t.growth >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(t.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Keyword Analysis">
        {keywordList.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No keyword data yet.</p>
        ) : (
          <div className="space-y-2">
            {keywordList.map((k) => (
              <div key={k.keyword} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                <span className="text-xs font-medium text-text">{k.keyword}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted">{k.articles} articles</span>
                  <span className="text-[10px] text-muted">{k.videos} videos</span>
                  <span className={cn("flex items-center gap-0.5 text-[9px] font-medium", k.growth >= 0 ? "text-red-500" : "text-emerald-500")}>
                    {k.growth >= 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                    {Math.abs(k.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Security News">
          {articles.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No articles yet.</p>
          ) : (
            <div className="space-y-2">
              {articles.map((n) => (
                <div key={n.id} className="rounded-xl bg-surface/20 px-3 py-2">
                  <p className="line-clamp-1 text-xs font-medium text-text">{n.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted">
                    <span>{n.category}</span>
                    <span>·</span>
                    <span>{fmtDate(n.publishedAt)}</span>
                    <span>·</span>
                    <span className="rounded bg-red-500/10 px-1 py-0.5 text-[8px] text-red-500">{n.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Security Videos">
          {videos.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No videos yet.</p>
          ) : (
            <div className="space-y-2">
              {videos.map((v) => (
                <button key={v.id} onClick={() => setPlayingVideo({ videoId: v.videoId, title: v.title })}
                  className="w-full rounded-xl bg-surface/20 px-3 py-2 text-left transition-colors hover:bg-surface/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <Play className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium text-text">{v.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted">
                        <span>{v.channelName}</span>
                        <span>·</span>
                        <span>{v.views.toLocaleString()} views</span>
                        <span>·</span>
                        <span className="rounded bg-red-500/10 px-1 py-0.5 text-[8px] text-red-500">{v.category}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
      {playingVideo && (
        <YouTubeEmbed videoId={playingVideo.videoId} title={playingVideo.title} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
}
