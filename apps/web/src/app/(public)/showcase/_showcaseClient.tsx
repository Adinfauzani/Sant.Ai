"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { Search, SlidersHorizontal, X, Users, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hoverCard";
import ProjectCard, { ProjectCardGrid, ProjectCardEmpty } from "@/components/project/ProjectCard";
import type { ShowcaseProject } from "@/lib/showcase";

const sortOptions = ["Highest Impact", "Newest", "Most Members"];

const accents = [
  "from-blue-600/30 to-cyan-400/10",
  "from-purple-600/30 to-violet-400/10",
  "from-emerald-600/30 to-teal-400/10",
  "from-red-600/30 to-rose-400/10",
  "from-sky-600/30 to-blue-400/10",
  "from-pink-600/30 to-rose-400/10",
  "from-amber-600/30 to-orange-400/10",
  "from-indigo-600/30 to-blue-400/10",
];

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400",
  TI: "bg-emerald-500/15 text-emerald-400",
  SI: "bg-purple-500/15 text-purple-400",
};

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
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-4 py-2.5 transition-colors focus-within:border-primary/30">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted hover:text-text">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-text shadow-sm hover:bg-surface transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                  {filter !== "All" ? filter : "Category"}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  align="start"
                  className="w-56 rounded-xl border border-border bg-card p-3 shadow-lg will-change-[transform,opacity]"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-xs font-semibold text-text">Filter by Category</p>
                    <Popover.Close className="rounded-md p-0.5 text-muted hover:bg-surface hover:text-text transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </Popover.Close>
                  </div>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto">
                    {categories.map((c) => (
                      <Popover.Close asChild key={c}>
                        <button
                          onClick={() => setFilter(c)}
                          className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                            filter === c ? "bg-primary text-white" : "text-muted hover:bg-surface hover:text-text"
                          }`}
                        >
                          {c}
                        </button>
                      </Popover.Close>
                    ))}
                  </div>
                  <Popover.Arrow fill="var(--color-card)" width={10} height={5} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-[10px] text-muted outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Project */}
      {featured && (
        <Link
          href={`/projects/${featured.id}`}
          className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accents[0]} opacity-40`} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  Featured Project
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[9px] font-semibold text-muted">
                  <Users className="h-3 w-3 text-primary" />
                  {featured.contributors} contributors
                </span>
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold text-text md:text-3xl">{featured.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.programs.map((p) => (
                  <span key={p} className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold ${programColors[p]}`}>
                    {p}
                  </span>
                ))}
                {featured.techStack.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] text-primary">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[10px] text-muted">
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" />{featured.impact} impact</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" />{featured.memberCount} members</span>
                {featured.createdAt && (
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" />{formatDate(featured.createdAt)}</span>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <Button size="lg" className="gap-2">
                View Project <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      )}

      {/* Showcase Grid */}
      {filtered.length > 0 ? (
        <ProjectCardGrid className="xl:grid-cols-4">
          {filtered.map((p, i) => (
            <HoverCard key={p.id} openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ProjectCard
                    data={p}
                    href={`/projects/${p.id}`}
                    accent={accents[i % accents.length]}
                    variant="showcase"
                  />
                </motion.div>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="center" className="hidden md:block w-72">
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
                        <span key={`${r.program}-${r.title}`} className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold ${programColors[r.program] ?? ""}`}>
                          {r.program} {r.filled}/{r.required}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 border-t border-border pt-3 text-[10px] text-muted">
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{p.impact} impact</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.contributors}</span>
                    {p.createdAt && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(p.createdAt)}</span>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </ProjectCardGrid>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted">No projects match your filter.</p>
        </div>
      )}
    </div>
  );
}