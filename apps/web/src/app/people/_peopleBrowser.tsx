"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, GraduationCap, X, Users, ArrowRight, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PeopleItem } from "./page";

const PROGRAM_LABELS: Record<string, string> = {
  SD: "Sains Data",
  TI: "Teknik Informatika",
  SI: "Sistem Informasi",
};

const LEVEL_COLORS: Record<string, string> = {
  Newbie: "bg-zinc-500/15 text-zinc-400",
  Intermediate: "bg-blue-500/15 text-blue-400",
  Expert: "bg-amber-500/15 text-amber-400",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PeopleBrowser({ items }: { items: PeopleItem[] }) {
  const [q, setQ] = useState("");
  const [program, setProgram] = useState<string>("all");
  const [sort, setSort] = useState<"reputation" | "level" | "name">("reputation");

  const programs = ["all", "SD", "TI", "SI"];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = items.filter((u) => {
      if (program !== "all" && u.studyProgram !== program) return false;
      if (!needle) return true;
      const haystack = [u.name, u.username, u.bio, u.studyProgram ?? "", u.university, ...u.skills]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    const levelRank = { Expert: 3, Intermediate: 2, Newbie: 1 } as Record<string, number>;
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "level") return (levelRank[b.level] ?? 0) - (levelRank[a.level] ?? 0);
      return b.reputationPoints - a.reputationPoints;
    });
  }, [items, q, program, sort]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, username, keahlian, universitas…"
            className="w-full rounded-lg border border-border bg-surface/50 py-2 pl-9 pr-8 text-sm text-text outline-none placeholder:text-muted/50 focus:border-primary/30"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {programs.map((p) => (
            <button
              key={p}
              onClick={() => setProgram(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                program === p
                  ? "bg-primary text-white"
                  : "bg-surface/60 text-muted hover:bg-surface hover:text-text",
              )}
            >
              {p === "all" ? "Semua" : PROGRAM_LABELS[p]}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs text-text outline-none focus:border-primary/30"
        >
          <option value="reputation">Reputasi tertinggi</option>
          <option value="level">Level tertinggi</option>
          <option value="name">Nama A–Z</option>
        </select>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Users className="h-3.5 w-3.5" />
        {filtered.length} kolaborator ditemukan
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm font-semibold text-text">Tidak ada kolaborator yang cocok</p>
          <p className="mt-1 text-xs text-muted">Coba kata kunci atau filter lain.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <Link
              key={u.id}
              href={`/${u.username}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-3">
                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                    {initials(u.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-text group-hover:text-primary">
                      {u.name}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold",
                        LEVEL_COLORS[u.level] ?? "bg-primary/10 text-primary",
                      )}
                    >
                      {u.level}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-muted">@{u.username}</p>
                </div>
              </div>

              <p className={cn("mt-3 text-xs leading-relaxed text-muted", !u.bio && "italic")}>
                {u.bio ? u.bio.split("\n")[0] : "Belum ada bio."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
                {u.studyProgram && (
                  <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                    <GraduationCap className="h-3 w-3" />
                    {PROGRAM_LABELS[u.studyProgram] ?? u.studyProgram}
                    {u.semester ? ` · ${u.semester}` : ""}
                  </span>
                )}
                {u.skills.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-md bg-surface px-2 py-1 text-muted">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  {u.reputationPoints} reputasi
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Lihat profil <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}