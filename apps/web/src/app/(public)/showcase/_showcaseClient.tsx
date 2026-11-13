"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import {
  Search, SlidersHorizontal, X, Users, TrendingUp, Calendar, ArrowRight,
} from "lucide-react";
import { Button } from "@santai/ui/button";
import { Badge } from "@santai/ui/badge";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@santai/ui/input-group";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@santai/ui/hoverCard";
import ProjectCard, { ProjectCardGrid, ProjectCardEmpty } from "@/components/project/ProjectCard";
import type { ShowcaseProject } from "@/lib/data/showcase";

const sortOptions = ["Highest Impact", "Newest", "Most Members"];

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ShowcaseClient({ projects }: { projects: ShowcaseProject[] }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState(sortOptions[0]);
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.techStack) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [
      "All",
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t)
        .slice(0, 12),
    ];
  }, [projects]);

  const featured = useMemo(
    () => [...projects].sort((a, b) => b.impact - a.impact)[0],
    [projects],
  );

  const filtered = projects
    .filter((p) => {
      if (
        filter !== "All" &&
        !p.techStack.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
      ) {
        return false;
      }
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "Newest") return b.createdAt!.localeCompare(a.createdAt ?? "");
      if (sort === "Most Members") return b.contributors! - a.contributors!;
      return b.impact - a.impact;
    });

  if (projects.length === 0) {
    return (
      <div className="py-4">
        <ProjectCardEmpty createHref="/projects/create" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Search & Filters */}
      <div className="space-y-3">
        <InputGroup className="rounded-lg">
          <InputGroupAddon>
            <Search className="size-4 text-muted" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari proyek..."
            aria-label="Cari proyek"
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Bersihkan pencarian"
                className="rounded p-0.5 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-text transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                {filter !== "All" ? filter : "Kategori"}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="start"
                className="z-50 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-lg will-change-[transform,opacity]"
              >
                <div className="mb-1.5 flex items-center justify-between px-2 pt-1">
                  <p className="text-xs font-semibold text-text">Filter kategori</p>
                  <Popover.Close className="rounded p-0.5 text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <X className="size-3.5" />
                  </Popover.Close>
                </div>
                <div className="max-h-64 space-y-0.5 overflow-y-auto">
                  {categories.map((c) => (
                    <Popover.Close asChild key={c}>
                      <button
                        type="button"
                        onClick={() => setFilter(c)}
                        className={`w-full rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          filter === c
                            ? "bg-primary text-primary-foreground"
                            : "text-muted hover:bg-surface hover:text-text"
                        }`}
                      >
                        {c}
                      </button>
                    </Popover.Close>
                  ))}
                </div>
                <Popover.Arrow fill="var(--color-popover)" width={10} height={5} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <label className="flex items-center gap-2">
            <span className="text-xs text-muted">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Urutkan proyek"
              className="h-8 rounded-md border border-border bg-card px-2.5 text-xs text-text outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              {sortOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Featured Project */}
      {featured && (
        <Link
          href={`/projects/${featured.id}`}
          className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 hover:border-border-strong"
        >
          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  Featured Project
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-0.5 font-mono text-[9px] font-semibold text-muted">
                  <Users className="size-3 text-primary" />
                  {featured.contributors} contributors
                </span>
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-text md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.programs.map((p) => (
                  <Badge key={p} variant="outline" className="font-mono text-[9px]">
                    {p}
                  </Badge>
                ))}
                {featured.techStack.slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="font-mono text-[9px]">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-muted">
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-3 text-primary" />
                  {featured.impact} impact
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3 text-primary" />
                  {featured.memberCount} members
                </span>
                {featured.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-primary" />
                    {formatDate(featured.createdAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <Button size="lg" className="gap-2">
                Lihat Proyek
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </Link>
      )}

      {/* Showcase Grid */}
      {filtered.length > 0 ? (
        <ProjectCardGrid className="xl:grid-cols-4">
          {filtered.map((p) => (
            <HoverCard key={p.id} openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <ProjectCard data={p} href={`/projects/${p.id}`} variant="showcase" />
              </HoverCardTrigger>
              <HoverCardContent side="right" align="center" className="hidden w-72 md:block">
                <div className="space-y-3 p-4">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-text">{p.title}</h4>
                    <p className="mt-1.5 line-clamp-4 text-[11px] leading-relaxed text-muted">
                      {p.problemStatement || p.description}
                    </p>
                  </div>
                  {p.openRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.openRoles.map((r) => (
                        <Badge
                          key={`${r.program}-${r.title}`}
                          variant="outline"
                          className="font-mono text-[9px]"
                        >
                          {r.program} {r.filled}/{r.required}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 border-t border-border pt-3 text-[10px] text-muted">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      {p.impact} impact
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {p.contributors}
                    </span>
                    {p.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(p.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </ProjectCardGrid>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted">Tidak ada proyek yang cocok dengan filter.</p>
        </div>
      )}
    </div>
  );
}
