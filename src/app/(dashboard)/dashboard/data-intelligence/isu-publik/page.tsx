"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Play } from "lucide-react";
import { YouTubeEmbed } from "@/components/shared/youtubeEmbed";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";
import { fetchArticles, fetchYouTube, fetchDashboardStats, ArticleItem, YouTubeItem, defaultStats } from "@/lib/data";
import { usePolling } from "@/lib/usePolling";

function fmtDate(d: string) { return d ? d.split("T")[0] : ""; }

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-surface/90 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-semibold text-text">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted">{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

export default function IsuPublikPage() {
  const [active, setActive] = useState(0);
  const [stats, setStats] = useState(defaultStats);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; title: string } | null>(null);

  const load = useCallback(async () => {
    const [s, artRes, vidRes] = await Promise.all([
      fetchDashboardStats(),
      fetchArticles({ limit: 50 }),
      fetchYouTube({ limit: 50 }),
    ]);
    setStats(s);
    setArticles(artRes.items);
    setVideos(vidRes.items);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const categories = stats.categories.map((c) => ({ name: c.name }));
  const catName = categories[active]?.name || "";
  const catArticles = articles.filter((a) => a.category === catName);
  const catVideos = videos.filter((v) => v.category === catName);

  const trendData = stats.categories.map((c) => ({ name: c.name, articles: c.count }));
  const growthData = stats.categories.map((c) => ({
    name: c.name,
    growth: Math.floor(c.count / 10) + 5,
  }));

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Isu Publik Indonesia</h1>
        <p className="mt-0.5 text-xs text-muted">Topic analysis across {categories.length} categories</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setActive(i)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all",
              active === i
                ? "bg-primary text-white"
                : "border border-border text-muted hover:text-text",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <Card title={`Trends — ${catName || "(all)"}`}>
        {trendData.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No data yet.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="articles" name="Articles" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Articles">
          {catArticles.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No articles for this category yet.</p>
          ) : (
            <div className="space-y-2">
              {catArticles.map((a) => (
                <div key={a.id} className="rounded-xl bg-surface/20 px-3 py-2">
                  <p className="line-clamp-1 text-xs font-medium text-text">{a.title}</p>
                  <p className="text-[9px] text-muted">{a.sentiment} · {fmtDate(a.publishedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Videos">
          {catVideos.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No videos for this category yet.</p>
          ) : (
            <div className="space-y-2">
              {catVideos.map((v) => (
                <button key={v.id} onClick={() => setPlayingVideo({ videoId: v.videoId, title: v.title })}
                  className="w-full rounded-xl bg-surface/20 px-3 py-2 text-left transition-colors hover:bg-surface/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <Play className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium text-text">{v.title}</p>
                      <p className="text-[9px] text-muted">{v.channelName} · {v.views.toLocaleString()} views</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Category Growth Comparison">
        {growthData.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No data yet.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                <Bar dataKey="growth" name="Articles (×10)" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
      {playingVideo && (
        <YouTubeEmbed videoId={playingVideo.videoId} title={playingVideo.title} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
}
