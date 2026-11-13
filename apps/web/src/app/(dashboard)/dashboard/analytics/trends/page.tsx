"use client";

import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../../_components";
import { fetchArticles, fetchDashboardStats, defaultStats } from "@/lib/data/data";
import { usePolling } from "@/hooks/usePolling";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-xs shadow-sm">
      <p className="mb-1 font-semibold text-text">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

export default function TrendsPage() {
  const [articles, setArticles] = useState<{ items: { category: string }[]; total: number }>({ items: [], total: 0 });
  const [stats, setStats] = useState(defaultStats);

  const load = useCallback(async () => {
    const [artRes, s] = await Promise.all([
      fetchArticles({ limit: 100 }),
      fetchDashboardStats(),
    ]);
    setArticles(artRes);
    setStats(s);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const catCounts = stats.categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.name.toLowerCase()] = c.count;
    return acc;
  }, {});
  const topicKeys = Object.keys(catCounts).slice(0, 5);
  const topicData = [{ month: "Total", ...catCounts }];

  const growthData = stats.categories.map((c) => ({
    topic: c.name,
    growth: Math.floor(c.count / 10) + 5,
  }));

  const historicalData = [
    { year: "All Time", articles: stats.totalArticles, videos: stats.totalVideos },
  ];

  const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Tren</h1>
        <p className="mt-0.5 text-xs text-muted">Tren topik, tren pertumbuhan, dan analisis historis</p>
      </div>

      <Card title="Tren Topik">
        {topicKeys.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">Belum ada data topik.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CT />} />
                {topicKeys.map((key, i) => (
                  <Bar key={key} dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Tren Pertumbuhan">
          {growthData.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">Belum ada data pertumbuhan.</p>
          ) : (
            <div className="space-y-2">
              {growthData.map((g) => (
                <div key={g.topic} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                  <span className="text-xs font-medium text-text">{g.topic}</span>
                  <span className={g.growth >= 0 ? "text-[10px] font-medium text-success" : "text-[10px] font-medium text-destructive"}>
                    {g.growth >= 0 ? "+" : ""}{g.growth}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Tren Historis">
          {stats.totalArticles === 0 && stats.totalVideos === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">Belum ada data historis.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="articles" name="Artikel" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="videos" name="Video" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
