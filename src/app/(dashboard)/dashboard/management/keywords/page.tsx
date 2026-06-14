"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../../_components";
import { fetchKeywords, type KeywordItem } from "@/lib/data";
import { usePolling } from "@/lib/use-polling";

export default function MgmtKeywordsPage() {
  const [items, setItems] = useState<KeywordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState("");

  const load = useCallback(async () => {
    const data = await fetchKeywords();
    setItems(data.items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 60_000);

  const add = () => {
    if (!newWord.trim()) return;
    const fakeId = `local-${Date.now()}`;
    setItems([{ id: fakeId, keyword: newWord, category: "Custom", active: true }, ...items]);
    setNewWord("");
  };

  const toggle = (id: string) => setItems(items.map((k) => k.id === id ? { ...k, active: !k.active } : k));
  const remove = (id: string) => setItems(items.filter((k) => k.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Manage Keywords</h1>
        <p className="mt-0.5 text-xs text-muted">Create, read, update, and delete keyword mappings</p>
      </div>

      <div className="flex gap-2">
        <input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add new keyword..."
          className="flex-1 rounded-xl border border-border bg-surface/30 px-3 py-2 text-xs text-text outline-none placeholder:text-muted transition-colors focus:border-primary"
        />
        <button onClick={add} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </div>

      <Card
        title={`Keyword Mappings (${items.length})`}
        action={
          <button onClick={load} className="rounded-lg border border-border px-2 py-1 text-[10px] transition-colors hover:bg-surface hover:text-text">
            Refresh
          </button>
        }
      >
        {loading ? (
          <p className="py-4 text-center text-[10px] text-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-[10px] text-muted">No keywords yet</p>
        ) : (
          <div className="space-y-1">
            {items.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-xl bg-surface/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(k.id)}
                    className={cn("h-4 w-4 rounded border transition-colors", k.active ? "border-primary bg-primary" : "border-border bg-surface")}
                  >
                    {k.active && <span className="flex h-full items-center justify-center text-[8px] text-white">✓</span>}
                  </button>
                  <div>
                    <p className="text-xs font-medium text-text">{k.keyword}</p>
                    <p className="text-[9px] text-muted">{k.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-text">
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button onClick={() => remove(k.id)} className="flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
