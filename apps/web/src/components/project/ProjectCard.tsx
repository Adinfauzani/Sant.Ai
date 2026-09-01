"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Star, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@santai/ui/progress";
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

const statusConfig: Record<string, { label: string; emoji: string }> = {
  Live:        { label: "Live",        emoji: "🟢" },
  Open:        { label: "Open",        emoji: "🟢" },
  Recruiting:  { label: "Recruiting",  emoji: "🟢" },
  "In Progress": { label: "In Progress", emoji: "🟡" },
  Featured:    { label: "Featured",    emoji: "🔵" },
  Active:      { label: "Active",      emoji: "🟢" },
  Planning:    { label: "Planning",    emoji: "🟡" },
  Review:      { label: "Review",      emoji: "🔵" },
  Completed:   { label: "Completed",   emoji: "⚪" },
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

  /* ── Accent border ── */
  const accentBorder = accent ? "border-primary/20" : undefined;

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
          "flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 ease-out",
          "group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:border-primary",
          accentBorder ? `border ${accentBorder}` : "border-border",
          hovered ? "border-primary" : accentBorder ?? "border-border",
        )}
      >
        {/* ── Thin accent top bar ── */}
        {accent && (
          <div className="bg-gradient-to-r h-0.5 -mx-6 -mt-6 mb-4 rounded-t-xl from-primary/20 to-primary/5" />
        )}

        {/* ── Status badge ── */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-muted ring-1 ring-border">
            <span className="text-xs leading-none">{status.emoji}</span>
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
              className="rounded-md bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary"
            >
              {t}
            </span>
          ))}
          {overflowCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] text-muted ring-1 ring-border transition-colors hover:bg-border">
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

        {/* ── Creator section (revealed on hover) ── */}
        <div
          className={cn(
            "mt-4 flex items-center gap-3 overflow-hidden transition-all duration-300 ease-out",
            hovered ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-2 ring-card">
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
        <div
          className={cn(
            "mt-4 border-t border-border transition-all duration-300",
            hovered ? "opacity-100" : "opacity-0",
          )}
        />

        {/* ── Progress ── */}
        <div ref={progressRef} className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
              Progress
            </span>
            <span className="font-mono text-[10px] text-muted">{data.progress}%</span>
          </div>
          <Progress
            value={progressVisible ? data.progress : 0}
            className="h-1.5"
          />
        </div>

        {/* ── Metadata (revealed on hover) ── */}
        <div
          className={cn(
            "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 overflow-hidden transition-all duration-300 delay-75 ease-out",
            hovered ? "max-h-8 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {data.contributors !== undefined && (
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <Users className="h-3 w-3" />
              {data.contributors} Contributors
            </span>
          )}
          {data.rating !== undefined && (
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {data.rating.toFixed(1)} Rating
            </span>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200",
              href ? "text-primary" : "text-muted",
              "group-hover:gap-2.5",
            )}
          >
            {hovered && href ? "Open Workspace" : "View Workspace"}
            <ArrowRight
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                hovered && "translate-x-1",
              )}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────── */

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded-full bg-border" />
      </div>
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-border" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-border" />
      <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-border" />
      <div className="mt-4 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-14 animate-pulse rounded-md bg-border" />
        ))}
      </div>
      <div className="mt-4 border-t border-border" />
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="h-3 w-16 animate-pulse rounded bg-border" />
          <div className="h-3 w-8 animate-pulse rounded bg-border" />
        </div>
        <div className="h-1.5 w-full animate-pulse rounded-full bg-border" />
      </div>
      <div className="mt-4">
        <div className="h-4 w-28 animate-pulse rounded bg-border" />
      </div>
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
    <div className="col-span-full rounded-xl border border-border bg-card p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
        <Users className="h-6 w-6 text-muted" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-text">
        No projects yet
      </h3>
      <p className="mt-1 text-sm text-muted">
        Be the first to create a project and start collaborating.
      </p>
      {createHref && (
        <Link href={createHref}>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            Create Project
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
