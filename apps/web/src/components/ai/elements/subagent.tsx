"use client";

import type { ComponentProps, ReactNode } from "react";
import { Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SubagentStatus = "idle" | "running" | "completed" | "error" | "cancelled";

export function Subagent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="subagent"
      className={cn("w-full rounded-xl border border-border bg-card/60 p-3", className)}
      {...props}
    />
  );
}

export function SubagentHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="subagent-header" className={cn("flex items-start gap-2", className)} {...props} />;
}

export function SubagentIcon({ status = "idle", className }: { status?: SubagentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted",
        status === "running" && "border-primary/30 bg-primary/10 text-primary",
        status === "completed" && "border-primary/30 bg-primary/10 text-primary",
        status === "error" && "border-destructive/30 bg-destructive-soft text-destructive",
        className,
      )}
    >
      {status === "running" ? <Loader2 className="size-3.5 animate-spin" /> : <Bot className="size-3.5" />}
    </span>
  );
}

export function SubagentName({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="subagent-name" className={cn("text-xs font-medium text-text", className)} {...props} />;
}

export function SubagentDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="subagent-description" className={cn("mt-0.5 text-[11px] leading-relaxed text-muted", className)} {...props} />;
}

export function SubagentStatusBadge({ status = "idle" }: { status?: SubagentStatus }) {
  const label: Record<SubagentStatus, string> = {
    idle: "Siap",
    running: "Berjalan",
    completed: "Selesai",
    error: "Gagal",
    cancelled: "Dibatalkan",
  };
  return (
    <span
      data-status={status}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        status === "running" && "bg-primary/10 text-primary",
        status === "completed" && "bg-primary-soft text-primary",
        status === "error" && "bg-destructive-soft text-destructive",
        (status === "idle" || status === "cancelled") && "bg-surface text-muted",
      )}
    >
      {label[status]}
    </span>
  );
}

export function SubagentOutput({ children, empty = "Belum ada keluaran.", className }: { children?: ReactNode; empty?: ReactNode; className?: string }) {
  return (
    <div data-slot="subagent-output" className={cn("mt-2 rounded-lg border border-border bg-surface/50 p-2 text-xs text-text-secondary", className)}>
      {children ?? <span className="text-muted">{empty}</span>}
    </div>
  );
}
