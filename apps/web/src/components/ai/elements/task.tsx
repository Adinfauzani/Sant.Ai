"use client";

import type { ComponentProps, ReactNode } from "react";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "pending" | "in-progress" | "completed" | "error";

export function Task({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="task"
      className={cn("w-full rounded-xl border border-border bg-card/60", className)}
      {...props}
    />
  );
}

export function TaskHeader({
  title,
  status = "pending",
  meta,
  className,
}: {
  title: ReactNode;
  status?: TaskStatus;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 border-b border-border px-3 py-2", className)}>
      <TaskStatusIcon status={status} />
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-text">{title}</span>
      {meta ? <span className="shrink-0 text-[10px] text-muted">{meta}</span> : null}
    </div>
  );
}

export function TaskStatusIcon({ status = "pending", className }: { status?: TaskStatus; className?: string }) {
  if (status === "completed") return <CheckCircle2 className={cn("size-4 shrink-0 text-primary", className)} />;
  if (status === "in-progress") return <Loader2 className={cn("size-4 shrink-0 animate-spin text-primary", className)} />;
  if (status === "error") return <XCircle className={cn("size-4 shrink-0 text-destructive", className)} />;
  return <Circle className={cn("size-4 shrink-0 text-muted", className)} />;
}

export function TaskList({ className, ...props }: ComponentProps<"ul">) {
  return <ul data-slot="task-list" className={cn("divide-y divide-border", className)} {...props} />;
}

export function TaskItem({
  title,
  description,
  status = "pending",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  status?: TaskStatus;
  className?: string;
}) {
  return (
    <li className={cn("flex items-start gap-2 px-3 py-2 text-xs", className)} data-status={status}>
      <span className="mt-0.5">
        <TaskStatusIcon status={status} className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn("font-medium", status === "completed" ? "text-text-secondary" : "text-text")}>{title}</div>
        {description ? <div className="mt-0.5 text-[11px] leading-relaxed text-muted">{description}</div> : null}
      </div>
    </li>
  );
}

export function TaskProgress({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cn("px-3 pb-2", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[10px] text-muted">{Math.round(pct)}%</div>
    </div>
  );
}
