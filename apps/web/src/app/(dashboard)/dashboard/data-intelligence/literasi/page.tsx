"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, Play } from "lucide-react";
import { YouTubeEmbed } from "@santai/ui/youtubeEmbed";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";
import { fetchArticles, fetchYouTube, fetchDashboardStats, ArticleItem, YouTubeItem } from "@/lib/data/data";
import { usePolling } from "@/hooks/usePolling";

function fmtDate(d: string) {
  return d ? d.split("T")[0] : "";
}

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-xs shadow-sm">
      <p className="font-semibold text-text">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

export default function LiterasiPage() {
  const [dateFilter, setDateFilter] = useState("7d");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState("all");

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [keywordData, setKeywordData] = useState<{ keyword: string; mentions: number; growth: number }[]>([]);
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; title: string } | null>(null);

  const load = useCallback(async () => {
    const [artRes, vidRes, stats] = await Promise.all([
      fetchArticles({ category: "Literasi Digital", limit: 10 }),
      fetchYouTube({ limit: 10 }),
      fetchDashboardStats(),
    ]);
    setArticles(artRes.items);
    setVideos(vidRes.items);
    setKeywordData(
      stats.categories.map((c) => ({
        keyword: c.name,
        mentions: c.count,
        growth: Math.floor(Math.random() * 50) + 5,
      })),
    );
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const base = "rounded-lg border border-input bg-surface/30 px-2.5 py-1.5 text-[10px] text-muted transition-colors hover:border-input-hover focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Literasi Digital</h1>
        <p className="mt-0.5 text-xs text-muted">Artikel, video, tren, dan analisis kata kunci</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={base}>
          <option value="24h">24 Jam Terakhir</option>
          <option value="7d">7 Hari Terakhir</option>
          <option value="30d">30 Hari Terakhir</option>
          <option value="90d">90 Hari Terakhir</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={base}>
          <option value="all">Semua Sumber</option>
          <option value="portal">Portal Berita</option>
          <option value="youtube">YouTube</option>
          <option value="sosial">Media Sosial</option>
        </select>
        <select value={keywordFilter} onChange={(e) => setKeywordFilter(e.target.value)} className={base}>
          <option value="all">Semua Kata Kunci</option>
          {keywordData.map((k) => <option key={k.keyword} value={k.keyword}>{k.keyword}</option>)}
        </select>
      </div>

      <Card title="Analisis Kata Kunci">
        {keywordData.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">Belum ada data kata kunci.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywordData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="keyword" tick={{ fontSize: 8, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="mentions" name="Sebutan" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Articles">
          {articles.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">Belum ada artikel.</p>
          ) : (
            <div className="space-y-2">
              {articles.map((a) => (
                <div key={a.id} className="rounded-xl bg-surface/20 px-3 py-2">
                  <p className="line-clamp-1 text-xs font-medium text-text">{a.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted">
                    <span>{a.category}</span>
                    <span>·</span>
                    <span>{fmtDate(a.publishedAt)}</span>
                    <span>·</span>
                    <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] text-primary">{a.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Videos">
          {videos.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">Belum ada video.</p>
          ) : (
            <div className="space-y-2">
              {videos.map((v) => (
                <button key={v.id} onClick={() => setPlayingVideo({ videoId: v.videoId, title: v.title })}
                  className="w-full rounded-xl bg-surface/20 px-3 py-2 text-left transition-colors hover:bg-surface/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <Play className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium text-text">{v.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted">
                        <span>{v.channelName}</span>
                        <span>·</span>
                        <span>{v.views.toLocaleString()} views</span>
                        <span>·</span>
                        <span className="rounded bg-primary/10 px-1 py-0.5 text-[8px] text-primary">{v.category}</span>
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
