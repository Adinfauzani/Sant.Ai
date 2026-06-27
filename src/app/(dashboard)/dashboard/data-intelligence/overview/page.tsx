"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card } from "../../_components";
import { fetchDashboardStats, defaultStats } from "@/lib/data";
import { usePolling } from "@/lib/usePolling";

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu"];

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

export default function OverviewPage() {
  const [stats, setStats] = useState(defaultStats);

  const refresh = useCallback(() => { fetchDashboardStats().then(setStats); }, []);

  useEffect(() => { refresh(); }, [refresh]);
  usePolling(refresh, 30_000); // 30 detik

  const trendData = months.map((month) => ({
    month,
    articles: Math.round(stats.totalArticles / 8),
    videos: Math.round(stats.totalVideos / 8),
  }));

  const catDist = Object.entries(
    stats.categories.reduce((acc, c) => {
      acc[c.name] = (acc[c.name] || 0) + c.count;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const sourceActivity = [
    { name: "Articles", articles: stats.totalArticles, change: "+12%" },
    { name: "Videos", articles: stats.totalVideos, change: "+8%" },
    { name: "Categories", articles: stats.categories.length, change: "+5%" },
    { name: "Sources", articles: stats.activeSources, change: "+15%" },
    { name: "Keywords", articles: stats.totalKeywords, change: "+22%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Data Intelligence Overview</h1>
        <p className="mt-0.5 text-xs text-muted">Unified analytics view across all categories and sources</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Articles", value: stats.totalArticles.toLocaleString() },
          { label: "Total Videos", value: stats.totalVideos.toLocaleString() },
          { label: "Active Sources", value: stats.activeSources.toLocaleString() },
          { label: "Keywords Tracked", value: stats.totalKeywords.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-gradient-to-br from-surface/30 to-surface/10 p-4">
            <p className="text-[10px] text-muted">{s.label}</p>
            <p className="font-heading text-2xl font-bold text-text">{s.value || "0"}</p>
          </div>
        ))}
      </div>

      <Card title="Content Growth Trends">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="ov-og" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
                <linearGradient id="ov-vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="articles" name="Articles" stroke="#2563eb" fill="url(#ov-og)" strokeWidth={2} />
              <Area type="monotone" dataKey="videos" name="Videos" stroke="#8b5cf6" fill="url(#ov-vg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Source Activity">
          <div className="space-y-2">
            {sourceActivity.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                <span className="text-xs font-medium text-text">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted">{s.articles.toLocaleString()}</span>
                  <span className="text-[9px] font-medium text-emerald-500">{s.change}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Category Distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catDist.length > 0 ? catDist : [{ name: "No Data", value: 1 }]} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {catDist.length > 0 ? catDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />) : <Cell fill="#27272a" />}
                </Pie>
                <Tooltip content={<CT />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {(catDist.length > 0 ? catDist : []).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 rounded-lg bg-surface/20 px-2 py-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <p className="flex-1 text-[9px] text-muted">{c.name}</p>
                <p className="text-[9px] font-medium text-text">{c.value}</p>
              </div>
            ))}
            {catDist.length === 0 && <p className="col-span-2 py-2 text-center text-[10px] text-muted">No categories yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
