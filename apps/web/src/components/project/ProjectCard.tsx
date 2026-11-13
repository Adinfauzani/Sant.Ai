"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Users, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@santai/ui/progress";
import { TwinOrbit } from "@santai/ui/twinOrbit";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@santai/ui/tooltip";

/* ─── Types ─────────────────────────────────────────── */

export interface ProjectCardRole {
  program: string;
  title: string;
  filled: number;
  required: number;
}

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string[];
  programs: string[];
  progress: number;
  memberCount: number;
  maxMemberCount: number;
  impact: number;
  votes: number;
  openRoles: ProjectCardRole[];
  createdAt?: string;
  projectLead?: string;
  discussionCount?: number;
  milestonesCompleted?: number;

  creatorName?: string;
  creatorAvatar?: string;
  university?: string;
  contributors?: number;
  rating?: number;
  updatedAt?: string;
}

/* ─── Status config ─────────────────────────────────── */

const statusConfig: Record<string, { label: string; dot: string }> = {
  Live:        { label: "Live",        dot: "bg-success" },
  Open:        { label: "Open",        dot: "bg-success" },
  Recruiting:  { label: "Recruiting",  dot: "bg-success" },
  "In Progress": { label: "In Progress", dot: "bg-warning" },
  Featured:    { label: "Featured",    dot: "bg-primary" },
  Active:      { label: "Active",      dot: "bg-success" },
  Planning:    { label: "Planning",    dot: "bg-warning" },
  Review:      { label: "Review",      dot: "bg-primary" },
  Completed:   { label: "Completed",   dot: "bg-border-strong" },
};

/* ─── Component ─────────────────────────────────────── */

interface ProjectCardProps {
  data: ProjectCardData;
  href?: string;
  className?: string;
  onJoin?: (id: string) => void;
  accent?: string;
  variant?: "project" | "showcase";
  views?: number;
  likes?: number;
}

export default function ProjectCard({
  data,
  href,
  className,
  onJoin,
  accent,
  variant = "project",
  views,
  likes,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progressVisible, setProgressVisible] = useState(false);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgressVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const status = statusConfig[data.status] ?? statusConfig.Planning;

  const visibleTags = data.techStack.slice(0, 3);
  const overflowCount = data.techStack.length - 3;

  return (
    <div
      className={cn("group relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "flex flex-col rounded-xl border border-border bg-card p-6 transition-colors duration-150",
          hovered && "border-border-strong",
        )}
      >
        {/* ── Thin accent top bar ── */}
        {accent && (
          <div
            aria-hidden="true"
            className="-mx-6 -mt-6 mb-4 h-0.5 rounded-t-xl bg-gradient-to-r from-primary/40 to-primary/5"
          />
        )}

        {/* ── Status badge ── */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-muted ring-1 ring-border">
            <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
            {status.label}
          </span>
        </div>

        {/* ── Title ── */}
        <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-text">
          {href ? (
            <Link href={href} className="after:absolute after:inset-0">
              {data.title}
            </Link>
          ) : (
            data.title
          )}
        </h3>

        {/* ── Description ── */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
          {data.description}
        </p>

        {/* ── Tags ── */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {visibleTags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-text-secondary"
            >
              {t}
            </span>
          ))}
          {overflowCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted transition-colors hover:text-text">
                    +{overflowCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="max-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {data.techStack.slice(3).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* ── Creator ── */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-2 ring-card">
            {data.creatorName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-text">
              {data.creatorName || "Unknown"}
            </p>
            {data.university && (
              <p className="truncate text-[9px] text-muted">{data.university}</p>
            )}
          </div>
        </div>

        {/* ── Separator ── */}
        <div className="mt-4 border-t border-border" />

        {/* ── Progress ── */}
        <div ref={progressRef} className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
              Progress
            </span>
            <span className="font-mono text-[10px] text-muted">{data.progress}%</span>
          </div>
          <Progress value={progressVisible ? data.progress : 0} className="h-1.5" />
        </div>

        {/* ── Metadata ── */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted">
          {data.contributors !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {data.contributors} Contributors
            </span>
          )}
          {data.rating !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {data.rating.toFixed(1)} Rating
            </span>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
              href ? "text-primary" : "text-muted",
            )}
          >
            {href ? "View Workspace" : "Open Workspace"}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────── */

export function ProjectCardSkeleton() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6">
      <TwinOrbit className="size-6 text-muted" />
      <p className="text-xs text-muted">Memuat proyek...</p>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────── */

export function ProjectCardEmpty({
  createHref,
}: {
  createHref?: string;
}) {
  return (
    <div className="col-span-full rounded-xl border border-border bg-card p-12 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl border border-border bg-surface">
        <Users className="h-6 w-6 text-muted" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-text">
        Belum ada proyek
      </h3>
      <p className="mt-1 text-sm text-muted">
        Jadilah yang pertama membuat proyek dan mulai kolaborasi.
      </p>
      {createHref && (
        <Link href={createHref} className="mt-5 inline-block">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            Buat Proyek
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  );
}

/* ─── Card grid wrapper ─────────────────────────────── */

export function ProjectCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  );
}
