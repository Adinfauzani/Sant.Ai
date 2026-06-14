"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "../../_components";
import { fetchArticles, ArticleItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-surface/90 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="mb-1 font-semibold text-text">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted" style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

export default function SentimentPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  const load = useCallback(async () => {
    const artRes = await fetchArticles({ limit: 100 });
    setArticles(artRes.items);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const dist = articles.reduce<Record<string, number>>((acc, a) => {
    const s = a.sentiment || "neutral";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const totalSentiment = Object.values(dist).reduce((sum, v) => sum + v, 0) || 1;
  const sentimentDist = Object.entries(dist).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round((value / totalSentiment) * 100),
  }));

  const catSentiment = articles.reduce<Record<string, { positive: number; neutral: number; negative: number; total: number }>>((acc, a) => {
    const cat = a.category || "Unknown";
    if (!acc[cat]) acc[cat] = { positive: 0, neutral: 0, negative: 0, total: 0 };
    acc[cat][a.sentiment as keyof typeof acc[string]] = (acc[cat][a.sentiment as keyof typeof acc[string]] || 0) + 1;
    acc[cat].total++;
    return acc;
  }, {});
  const byCategory = Object.entries(catSentiment).map(([category, data]) => ({
    category,
    positive: Math.round((data.positive / data.total) * 100) || 0,
    neutral: Math.round((data.neutral / data.total) * 100) || 0,
    negative: Math.round((data.negative / data.total) * 100) || 0,
  }));

  const sentimentTrend = [{ month: "All", ...Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, Math.round((v / totalSentiment) * 100)])) }];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Sentiment</h1>
        <p className="mt-0.5 text-xs text-muted">Sentiment analysis across all content</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Sentiment Distribution">
          {sentimentDist.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No sentiment data yet.</p>
          ) : (
            <>
              <div className="flex items-center justify-center h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentDist} cx="50%" cy="50%" innerRadius={48} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {sentimentDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CT />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {sentimentDist.map((s, i) => (
                  <div key={s.name} className="rounded-lg bg-surface/20 px-2 py-1.5 text-center">
                    <div className="h-2 w-2 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <p className="text-[9px] text-muted">{s.name}</p>
                    <p className="text-xs font-bold text-text">{s.value}%</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card title="Sentiment Trend">
          {sentimentTrend.length === 0 ? (
            <p className="py-8 text-center text-[10px] text-muted">No trend data yet.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="positive" name="Positive" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="neutral" name="Neutral" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="negative" name="Negative" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card title="Sentiment by Category">
        {byCategory.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No category sentiment data yet.</p>
        ) : (
          <div className="space-y-2">
            {byCategory.map((c) => (
              <div key={c.category} className="rounded-xl bg-surface/20 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-text">{c.category}</span>
                  <span className="text-[9px] text-muted">Pos: {c.positive}% · Neu: {c.neutral}% · Neg: {c.negative}%</span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-surface">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${c.positive}%` }} />
                  <div className="bg-amber-500 transition-all" style={{ width: `${c.neutral}%` }} />
                  <div className="bg-red-500 transition-all" style={{ width: `${c.negative}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
