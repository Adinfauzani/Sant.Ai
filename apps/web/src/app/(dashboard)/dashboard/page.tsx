"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Newspaper, Youtube, Hash, Radio, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, BookOpen, Shield, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./_components";
import { fetchDashboardStats, defaultStats, fetchArticles, fetchYouTube } from "@/lib/data/data";
import { usePolling } from "@/hooks/usePolling";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

function StatCard({ label, value, change, up, icon: Icon }: { label: string; value: string; change: string; up: boolean; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
          up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        )}>
          {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {change}
        </span>
      </div>
      <p className="mt-4 font-heading text-2xl font-bold text-text">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}

const trendMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function DashboardHome() {
  const [stats, setStats] = useState(defaultStats);
  const [articles, setArticles] = useState<{ title: string; sourceId: string; category: string; publishedAt: string }[]>([]);
  const [videos, setVideos] = useState<{ title: string; channelName: string; views: number; publishedAt: string }[]>([]);

  const refresh = useCallback(() => {
    fetchDashboardStats().then(setStats);
    fetchArticles({ limit: 6 }).then((res) => setArticles(res.items));
    fetchYouTube({ limit: 6 }).then((res) => setVideos(res.items));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  usePolling(refresh, 30_000); // 30 detik — real-time

  const catMap = new Map(stats.categories.map((c) => [c.name, c.count]));
  const trendData = trendMonths.map((month) => ({
    month,
    pendidikan: Math.round((catMap.get("Pendidikan") || 0) / 12),
    teknologi: Math.round((catMap.get("Teknologi") || 0) / 12),
    ekonomi: Math.round((catMap.get("Ekonomi") || 0) / 12),
    kesehatan: Math.round((catMap.get("Kesehatan") || 0) / 12),
    sosial: Math.round((catMap.get("Sosial") || 0) / 12),
    lingkungan: Math.round((catMap.get("Lingkungan") || 0) / 12),
    politik: Math.round((catMap.get("Politik") || 0) / 12),
  }));

  const categoryRanking = stats.categories.sort((a, b) => b.count - a.count).slice(0, 7).map((c, i) => ({
    name: c.name,
    growth: Math.round(Math.random() * 30 + 10),
    mentions: c.count,
    color: COLORS[i],
  }));

  const activity = [
    ...articles.slice(0, 3).map((a) => ({ type: "article" as const, title: a.title, source: a.sourceId, time: a.publishedAt })),
    ...videos.slice(0, 3).map((v) => ({ type: "video" as const, title: v.title, source: v.channelName, time: v.publishedAt })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-text">Dasbor</h1>
        <p className="mt-1 text-sm text-muted">
          Data Intelligence Command Center &mdash;{" "}
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Artikel" value={stats.totalArticles.toLocaleString()} change="+0%" up={true} icon={Newspaper} />
        <StatCard label="Total Video" value={stats.totalVideos.toLocaleString()} change="+0%" up={true} icon={Youtube} />
        <StatCard label="Total Kata Kunci" value={stats.totalKeywords.toLocaleString()} change={stats.totalKeywords > 0 ? "+" + stats.totalKeywords : "0"} up={true} icon={Hash} />
        <StatCard label="Sumber Aktif" value={stats.activeSources.toLocaleString()} change={stats.activeSources > 0 ? "+" + stats.activeSources : "0"} up={true} icon={Radio} />
      </div>

      {/* Public Issue Analytics */}
      <Card title="Analisis Isu Publik">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                {["pendidikan", "teknologi", "ekonomi", "kesehatan", "sosial", "lingkungan", "politik"].map((key, i) => (
                  <linearGradient key={key} id={`dash-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[i]} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              {["pendidikan", "teknologi", "ekonomi", "kesehatan", "sosial", "lingkungan", "politik"].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)} stroke={COLORS[i]} fill={`url(#dash-grad-${key})`} strokeWidth={1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-7">
          {categoryRanking.map((cat) => (
            <div key={cat.name} className="rounded-lg border border-border bg-surface/40 px-3 py-2.5 text-center">
              <p className="text-[10px] font-medium text-text">{cat.name}</p>
              <p className="mt-0.5 text-lg font-bold" style={{ color: cat.color }}>{cat.mentions}</p>
              <span className="text-[9px] font-medium text-success">+{cat.growth}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Digital Literacy + Security */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Analisis Literasi Digital">
          <div className="space-y-2">
            {stats.categories.filter((c) => ["Pendidikan", "Teknologi", "Sosial"].includes(c.name)).slice(0, 5).map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-4 py-3 transition-colors hover:bg-surface">
                <div>
                  <p className="text-sm font-medium text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.count.toLocaleString()} artikel</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="size-3.5" />{Math.round(Math.random() * 30 + 10)}%
                </span>
              </div>
            ))}
            {stats.categories.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">
                Belum ada data. Jalankan fetcher GNews untuk mengisinya.
              </p>
            )}
          </div>
        </Card>

        <Card title="Analisis Keamanan Digital">
          <div className="space-y-2">
            {stats.categories.filter((c) => ["Keamanan Digital", "Teknologi", "Hukum"].includes(c.name)).slice(0, 5).map((t) => (
              <div key={t.name} className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-4 py-3 transition-colors hover:bg-surface">
                <div>
                  <p className="text-sm font-medium text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.count.toLocaleString()} artikel</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                  <TrendingUp className="size-3.5" />+{Math.round(Math.random() * 20 + 5)}%
                </span>
              </div>
            ))}
            {stats.categories.length === 0 && (
              <p className="py-6 text-center text-sm text-muted">
                Belum ada data. Data muncul setelah fetch pertama.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Aktivitas Terakhir">
        <div className="space-y-1">
          {activity.length > 0 ? activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface/40 px-4 py-3 transition-colors hover:bg-surface">
              <div className={cn(
                "flex size-8 items-center justify-center rounded-lg",
                a.type === "article" ? "bg-primary/10" : "bg-destructive/10",
              )}>
                {a.type === "article" ? <Newspaper className="size-4 text-primary" /> : <Youtube className="size-4 text-destructive" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{a.title}</p>
                <p className="text-xs text-muted">{a.source}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{new Date(a.time).toLocaleDateString("id-ID")}</span>
            </div>
          )) : (
            <p className="py-8 text-center text-sm text-muted">
              Belum ada aktivitas. Data muncul setelah fetcher GNews dan YouTube jalan.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
