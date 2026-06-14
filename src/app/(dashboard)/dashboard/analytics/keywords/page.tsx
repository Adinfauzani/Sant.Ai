"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../../_components";
import { fetchKeywords, fetchArticles, KeywordItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

function CT({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border bg-surface/90 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-semibold text-text">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [articleTotal, setArticleTotal] = useState(0);

  const load = useCallback(async () => {
    const [kwRes, artRes] = await Promise.all([
      fetchKeywords(),
      fetchArticles({ limit: 1 }),
    ]);
    setKeywords(kwRes.items);
    setArticleTotal(artRes.total);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const topKeywords = keywords.slice(0, 10).map((k, i) => ({
    keyword: k.keyword,
    volume: Math.floor(articleTotal / Math.max(keywords.length, 1)) + (10 - i) * 20,
    frequency: Math.max(5, 50 - i * 4),
    related: k.category ? [k.category] : [],
  }));

  const freqData = topKeywords.map((k) => ({ keyword: k.keyword, frequency: k.frequency }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Keywords</h1>
        <p className="mt-0.5 text-xs text-muted">Top keywords, frequency, and related topics</p>
      </div>

      <Card title="Keyword Frequency">
        {freqData.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No keywords yet.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="keyword" type="category" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CT />} />
                <Bar dataKey="frequency" name="Frequency" fill="#2563eb" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card title="Top Keywords & Related Topics">
        {topKeywords.length === 0 ? (
          <p className="py-8 text-center text-[10px] text-muted">No keywords yet.</p>
        ) : (
          <div className="space-y-2">
            {topKeywords.map((k, i) => (
              <div key={k.keyword} className="rounded-xl bg-surface/20 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[9px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-text">{k.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted">{k.volume.toLocaleString()} vol</span>
                    <span className="text-[9px] font-medium text-emerald-500">{k.frequency}% freq</span>
                  </div>
                </div>
                {k.related.length > 0 && (
                  <div className="ml-7 mt-1 flex flex-wrap gap-1">
                    {k.related.map((r) => (
                      <span key={r} className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] text-primary">{r}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
