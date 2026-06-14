"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";
import { fetchSources, type SourceItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

export default function MgmtSourcesPage() {
  const [items, setItems] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchSources();
    setItems(data.items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Manage Sources</h1>
        <p className="mt-0.5 text-xs text-muted">Monitor and manage external data sources</p>
      </div>

      <Card
        title={`External Data Sources (${items.length})`}
        action={
          <button onClick={load} className="rounded-lg border border-border px-2 py-1 text-[10px] transition-colors hover:bg-surface hover:text-text">
            Refresh
          </button>
        }
      >
        {loading ? (
          <p className="py-4 text-center text-[10px] text-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-[10px] text-muted">No sources yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">RSS URL</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-surface/20">
                    <td className="py-2.5 pr-3">
                      <p className="text-xs font-medium text-text">{s.name}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-muted">{s.type}</td>
                    <td className="py-2.5 pr-3">
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[8px] font-medium",
                        s.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
                        s.status === "error" ? "bg-red-500/10 text-red-500" :
                        "bg-amber-500/10 text-amber-500",
                      )}>
                        {s.status}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate py-2.5 pr-3 text-muted" title={s.rssUrl}>{s.rssUrl || "—"}</td>
                    <td className="py-2.5">
                      <button className="rounded-lg border border-border px-2 py-1 text-[8px] text-muted hover:bg-surface hover:text-text">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
