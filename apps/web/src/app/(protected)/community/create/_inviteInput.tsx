"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { searchUsers, type InviteeInput } from "@/lib/community/communityActions";

interface Props {
  selected: InviteeInput[];
  onChange: (selected: InviteeInput[]) => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function InviteInput({ selected, onChange }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; username: string; image: string | null }[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);

  const selectedIds = new Set(selected.map((s) => s.id));

  const run = useCallback(async (needle: string) => {
    if (needle.length < 2) {
      setResults([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    const res = await searchUsers(needle);
    setResults(res.filter((u) => !selectedIds.has(u.id)));
    setBusy(false);
    setOpen(true);
  }, [selectedIds]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => run(q), 350);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q, run]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2 focus-within:border-primary">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          placeholder="@username atau email rekanmu…"
          className="flex-1 bg-transparent text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted"
        />
      </div>

      {open && (
        <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {busy ? (
            <li className="px-3 py-2.5 text-xs text-muted">Mencari…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2.5 text-xs text-muted">Tidak ada pengguna yang cocok.</li>
          ) : (
            results.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...selected, { id: u.id, username: u.username }]);
                    setQ("");
                    setResults([]);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-surface"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                    {initials(u.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-text">{u.name}</span>
                    <span className="block truncate font-mono text-[10px] text-primary">@{u.username}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary">
              @{s.username}
              <button
                type="button"
                onClick={() => onChange(selected.filter((x) => x.id !== s.id))}
                className="text-primary/60 transition-colors hover:text-destructive"
                aria-label={`Hapus @${s.username}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}