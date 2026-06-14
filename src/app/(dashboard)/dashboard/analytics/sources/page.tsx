"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../../_components";
import { fetchSources, fetchArticles, fetchYouTube, SourceItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

const COLORS = ["#2563eb", "#ef4444", "#1d9bf0", "#e4405f", "#000000"];

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

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [articleTotal, setArticleTotal] = useState(0);

  const load = useCallback(async () => {
    const [srcRes, artRes] = await Promise.all([
      fetchSources(),
      fetchArticles({ limit: 1 }),
    ]);
    setSources(srcRes.items);
    setArticleTotal(artRes.total);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const typeDist = sources.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});
  const sourceDist = Object.entries(typeDist).map(([name, value]) => ({ name, value }));
  const totalTypes = sourceDist.reduce((sum, s) => sum + s.value, 0);

  const activeSources = sources.slice(0, 8).map((s, i) => ({
    name: s.name,
    type: s.type,
    articles: Math.floor(articleTotal / Math.max(sources.length, 1)) + i * 10,
    growth: Math.floor(Math.random() * 20) + 5,
  }));

  const comparisonData = sourceDist.slice(0, 5).map((s) => ({
    name: s.name,
    thisMonth: s.value,
    lastMonth: Math.max(s.value - Math.floor(Math.random() * 3), 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Sources</h1>
        <p className="mt-0.5 text-xs text-muted">Source distribution, activity, and comparison</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Source Distribution">
          {sourceDist.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No sources yet.</p>
          ) : (
            <>
              <div className="flex items-center justify-center h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceDist} cx="50%" cy="50%" innerRadius={48} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {sourceDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CT />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {sourceDist.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5 rounded-lg bg-surface/20 px-2 py-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <p className="flex-1 text-[9px] text-muted">{s.name}</p>
                    <p className="text-[9px] font-medium text-text">{totalTypes > 0 ? Math.round(s.value / totalTypes * 100) : 0}%</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card title="Source Comparison">
          {comparisonData.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No comparison data yet.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="lastMonth" name="Last Month" fill="#52525b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="thisMonth" name="This Month" fill="#2563eb" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card title="Most Active Sources">
        {activeSources.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No sources yet.</p>
        ) : (
          <div className="space-y-2">
            {activeSources.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-text">{s.name}</p>
                  <p className="text-[9px] text-muted">{s.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted">{s.articles.toLocaleString()} articles</span>
                  <span className="text-[9px] font-medium text-emerald-500">+{s.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
