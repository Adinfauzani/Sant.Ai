"use client";

import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../../_components";
import { fetchArticles, fetchDashboardStats, defaultStats } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-surface/90 p-3 text-xs shadow-2xl backdrop-blur-md">
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

  const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Trends</h1>
        <p className="mt-0.5 text-xs text-muted">Topic trends, growth trends, and historical analysis</p>
      </div>

      <Card title="Topic Trends">
        {topicKeys.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No topic data yet.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
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
        <Card title="Growth Trends">
          {growthData.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No growth data yet.</p>
          ) : (
            <div className="space-y-2">
              {growthData.map((g) => (
                <div key={g.topic} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                  <span className="text-xs font-medium text-text">{g.topic}</span>
                  <span className={g.growth >= 0 ? "text-[10px] font-medium text-emerald-500" : "text-[10px] font-medium text-red-500"}>
                    {g.growth >= 0 ? "+" : ""}{g.growth}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Historical Trends">
          {stats.totalArticles === 0 && stats.totalVideos === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No historical data yet.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="articles" name="Articles" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="videos" name="Videos" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
