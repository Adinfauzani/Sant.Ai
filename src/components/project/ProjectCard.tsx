"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, ThumbsUp, Zap, Calendar, User, MessageSquare, Milestone,
  ArrowRight, UserPlus, Eye, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
  status: "Recruiting" | "Active" | "Planning" | "Review" | "Completed";
  techStack: string[];
  memberCount: number;
  maxMemberCount: number;
  impact: number;
  votes: number;
  programs: string[];
  progress: number;
  openRoles: ProjectCardRole[];
  createdAt?: string;
  projectLead?: string;
  discussionCount?: number;
  milestonesCompleted?: number;
}

/* ─── Status config ─────────────────────────────────── */

const statusConfig: Record<string, { label: string; dot: string; bg: string }> = {
  Recruiting: {
    label: "Recruiting",
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10 text-emerald-400",
  },
  Active: {
    label: "Active",
    dot: "bg-blue-500",
    bg: "bg-blue-500/10 text-blue-400",
  },
  Planning: {
    label: "Planning",
    dot: "bg-amber-500",
    bg: "bg-amber-500/10 text-amber-400",
  },
  Review: {
    label: "Review",
    dot: "bg-purple-500",
    bg: "bg-purple-500/10 text-purple-400",
  },
  Completed: {
    label: "Completed",
    dot: "bg-slate-500",
    bg: "bg-slate-500/10 text-slate-400",
  },
};

/* ─── Program badge colors ──────────────────────────── */

const programColors: Record<string, string> = {
  SD: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  TI: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  SI: "bg-purple-500/15 text-purple-400 border-purple-500/20",
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
  const status = statusConfig[data.status] ?? statusConfig.Planning;

  return (
    <div
      className={cn("group relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── gradient border layer ── */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[24px] opacity-0 blur-sm transition-all duration-500",
          "bg-gradient-to-br from-primary/30 via-primary/10 to-accent/30",
          hovered && "opacity-100 blur-md",
        )}
      />

      <div
        className={cn(
          "relative rounded-[24px] border border-border bg-surface/80 p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300",
          "hover:border-transparent",
          hovered && "scale-[1.02] shadow-xl shadow-primary/5",
        )}
      >
        {/* ── Inner card with gradient border effect ── */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300",
            "bg-gradient-to-br from-primary/8 via-transparent to-accent/8",
            hovered && "opacity-100",
          )}
        />

        {accent && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[24px]">
            <div className={cn("-mt-1 h-14 w-full bg-gradient-to-r", accent)} />
          </div>
        )}

        <div className="relative">
          {/* ── Header: status + date ── */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                status.bg,
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>

            {data.createdAt && (
              <span
                className={cn(
                  "flex items-center gap-1 font-mono text-[10px] text-muted transition-all duration-300",
                  hovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                <Calendar className="h-3 w-3" />
                {data.createdAt}
              </span>
            )}
          </div>

          {/* ── Title ── */}
          <h3
            className={cn(
              "mt-3 font-heading text-lg font-bold tracking-tight text-text transition-colors duration-300",
              hovered && "text-primary",
            )}
          >
            {href ? (
              <Link href={href} className="after:absolute after:inset-0">
                {data.title}
              </Link>
            ) : (
              data.title
            )}
          </h3>

          {/* ── Description ── */}
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
            {data.description}
          </p>

          {/* ── Tags ── */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.techStack.map((t) => (
              <span
                key={t}
                className="rounded-md bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary"
              >
                {t}
              </span>
            ))}
          </div>

          {/* ── Stats row ── */}
          <div className="mt-4 flex items-center gap-4">
            {variant === "showcase" && views !== undefined && likes !== undefined ? (
              <>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  {views}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Heart className="h-3.5 w-3.5 text-accent" />
                  {likes}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {data.memberCount}/{data.maxMemberCount}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  {data.impact}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <ThumbsUp className="h-3.5 w-3.5 text-accent" />
                  {data.votes}
                </span>
              </>
            )}
          </div>

          {/* ── Program badges ── */}
          {data.programs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.programs.map((p) => (
                <span
                  key={p}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold",
                    programColors[p] ?? "bg-surface text-muted border-border",
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* ── Progress ── */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                Progress
              </span>
              <span className="font-mono text-[10px] text-muted">{data.progress}%</span>
            </div>
            <Progress value={data.progress} />
          </div>

          {/* ── Open roles ── */}
          {data.openRoles.length > 0 && (
            <div className={cn(
              "mt-4 space-y-1 overflow-hidden transition-all duration-300",
              hovered ? "max-h-40" : "max-h-12",
            )}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                Open Roles
              </p>
              {data.openRoles.map((role) => (
                <div
                  key={`${role.program}-${role.title}`}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-text">
                    + {role.title}
                  </span>
                  <span className="text-muted">
                    {role.filled}/{role.required}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Hover-reveal extra info ── */}
          <div
            className={cn(
              "mt-4 grid grid-cols-2 gap-2 overflow-hidden border-t border-border pt-4 transition-all duration-300",
              hovered ? "max-h-40 opacity-100" : "max-h-0 border-transparent pt-0 opacity-0",
            )}
          >
            {data.projectLead && (
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <User className="h-3 w-3" />
                {data.projectLead}
              </span>
            )}
            {data.discussionCount !== undefined && (
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <MessageSquare className="h-3 w-3" />
                {data.discussionCount} Discussions
              </span>
            )}
            {data.milestonesCompleted !== undefined && (
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <Milestone className="h-3 w-3" />
                {data.milestonesCompleted} Milestones
              </span>
            )}
            {data.createdAt && (
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <Calendar className="h-3 w-3" />
                {data.createdAt}
              </span>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="mt-4 flex items-center gap-2">
            {href ? (
              <Button
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                asChild
              >
                <Link href={href}>
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
              >
                View Details
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
            {onJoin && (
              <Button
                size="sm"
                variant="outline"
                className="flex-none gap-1.5 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  onJoin(data.id);
                }}
              >
                <UserPlus className="h-3 w-3" />
                Join
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────── */

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-border bg-surface/80 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 animate-pulse rounded-full bg-border" />
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
      </div>
      <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-border" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-border" />
      <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-border" />
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-12 animate-pulse rounded-md bg-border" />
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2].map((i) => (
          <div key={i} className="h-4 w-10 animate-pulse rounded-md bg-border" />
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1 h-3 w-16 animate-pulse rounded bg-border" />
        <div className="h-2 w-full animate-pulse rounded-full bg-border" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-border" />
        <div className="h-9 w-20 animate-pulse rounded-lg bg-border" />
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
    <div className="col-span-full rounded-[24px] border border-border bg-surface/50 p-12 text-center backdrop-blur-sm">
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
          <Button variant="outline" size="sm" className="mt-5 gap-2">
            Create Project
            <ArrowRight className="h-4 w-4" />
          </Button>
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
