"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, GraduationCap, X, Users, ArrowRight, Trophy } from "lucide-react";
import { Badge } from "@santai/ui/badge";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group";
import { cn } from "@/lib/utils";
import type { PeopleItem } from "./page";

const PROGRAM_LABELS: Record<string, string> = {
  SD: "Sains Data",
  TI: "Teknik Informatika",
  SI: "Sistem Informasi",
};

const LEVEL_VARIANT: Record<string, "secondary" | "warning" | "default"> = {
  Newbie: "secondary",
  Intermediate: "warning",
  Expert: "default",
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
      const haystack = [
        u.name,
        u.username,
        u.bio,
        u.studyProgram ?? "",
        u.university,
        ...u.skills,
      ]
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
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <InputGroup className="flex-1 rounded-lg">
          <InputGroupAddon>
            <Search className="size-4 text-muted" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, username, keahlian, universitas..."
            aria-label="Cari kolaborator"
          />
          {q && (
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Bersihkan pencarian"
                className="rounded p-0.5 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3.5" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div
          role="group"
          aria-label="Filter program studi"
          className="flex items-center gap-1.5"
        >
          {programs.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProgram(p)}
              aria-pressed={program === p}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                program === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted hover:bg-hover hover:text-text",
              )}
            >
              {p === "all" ? "Semua" : PROGRAM_LABELS[p]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <span className="text-xs text-muted">Urutkan</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Urutkan kolaborator"
            className="h-8 rounded-md border border-border bg-card px-2.5 text-xs text-text outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="reputation">Reputasi tertinggi</option>
            <option value="level">Level tertinggi</option>
            <option value="name">Nama A–Z</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Users className="size-3.5" />
        {filtered.length} kolaborator ditemukan
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Users className="mx-auto size-8 text-muted" />
          <p className="mt-3 text-sm font-semibold text-text">
            Tidak ada kolaborator yang cocok
          </p>
          <p className="mt-1 text-xs text-muted">Coba kata kunci atau filter lain.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <Link
              key={u.id}
              href={`/${u.username}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors duration-150 hover:border-border-strong"
            >
              <div className="flex items-start gap-3">
                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.name}
                    className="size-12 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initials(u.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-text transition-colors group-hover:text-primary">
                      {u.name}
                    </p>
                    <Badge
                      variant={LEVEL_VARIANT[u.level] ?? "default"}
                      className="shrink-0 font-mono text-[9px]"
                    >
                      {u.level}
                    </Badge>
                  </div>
                  <p className="truncate text-[11px] text-muted">@{u.username}</p>
                </div>
              </div>

              <p
                className={cn("mt-3 text-xs leading-relaxed text-muted", !u.bio && "italic")}
              >
                {u.bio ? u.bio.split("\n")[0] : "Belum ada bio."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]">
                {u.studyProgram && (
                  <span className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 font-medium text-text-secondary">
                    <GraduationCap className="size-3" />
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
                  <Trophy className="size-3 text-warning" />
                  {u.reputationPoints} reputasi
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  Lihat profil
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
