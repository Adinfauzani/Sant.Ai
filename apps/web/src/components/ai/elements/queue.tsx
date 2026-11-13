"use client";

import type { ComponentProps, ReactNode } from "react";
import { Clock, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type QueueItemStatus = "queued" | "running" | "done" | "error" | "cancelled";

export interface QueueItemData {
  id: string;
  label: string;
  description?: string;
  status?: QueueItemStatus;
}

export function Queue({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="queue"
      className={cn("w-full rounded-xl border border-border bg-card/60", className)}
      {...props}
    />
  );
}

export function QueueHeader({
  title = "Antrian",
  count,
  className,
  actions,
}: {
  title?: ReactNode;
  count?: number;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-2 border-b border-border px-3 py-2", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-text">
        <Clock className="size-3.5 text-primary" />
        <span>{title}</span>
        {typeof count === "number" ? (
          <span className="rounded-full bg-surface px-1.5 py-px text-[10px] text-muted">{count}</span>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function QueueList({ className, ...props }: ComponentProps<"ul">) {
  return <ul data-slot="queue-list" className={cn("divide-y divide-border", className)} {...props} />;
}

export function QueueItem({
  item,
  onCancel,
  className,
}: {
  item: QueueItemData;
  onCancel?: (id: string) => void;
  className?: string;
}) {
  const status = item.status ?? "queued";
  return (
    <li
      data-slot="queue-item"
      data-status={status}
      className={cn("flex items-start gap-2 px-3 py-2 text-xs", className)}
    >
      <span className="mt-0.5 shrink-0">
        {status === "running" ? (
          <Loader2 className="size-3.5 animate-spin text-primary" />
        ) : status === "done" ? (
          <span className="flex size-3.5 items-center justify-center rounded-full bg-primary/15 text-[9px] text-primary">✓</span>
        ) : status === "error" ? (
          <span className="flex size-3.5 items-center justify-center rounded-full bg-destructive-soft text-[9px] text-destructive">!</span>
        ) : status === "cancelled" ? (
          <span className="flex size-3.5 items-center justify-center rounded-full bg-surface text-[9px] text-muted">–</span>
        ) : (
          <span className="flex size-3.5 items-center justify-center rounded-full border border-dashed border-border text-[9px] text-muted">•</span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate font-medium", status === "cancelled" ? "text-muted line-through" : "text-text")}>
          {item.label}
        </div>
        {item.description ? <div className="mt-0.5 text-[11px] text-muted">{item.description}</div> : null}
      </div>
      {onCancel && (status === "queued" || status === "running") ? (
        <button
          type="button"
          onClick={() => onCancel(item.id)}
          aria-label="Batalkan"
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </li>
  );
}

export function QueueEmpty({ children = "Tidak ada antrian.", className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("px-3 py-4 text-center text-xs text-muted", className)}>{children}</div>;
}
