"use client";

import type { ComponentProps, ReactNode } from "react";
import { Flag, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckpointStatus = "default" | "current" | "restored";

export function Checkpoint({
  status = "default",
  className,
  ...props
}: ComponentProps<"div"> & { status?: CheckpointStatus }) {
  return (
    <div
      data-slot="checkpoint"
      data-status={status}
      className={cn(
        "relative flex w-full items-center gap-3 py-2",
        "before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
      {...props}
    />
  );
}

export function CheckpointMarker({
  label,
  timestamp,
  onRestore,
  restoring = false,
  disabled,
  className,
}: {
  label?: ReactNode;
  timestamp?: string;
  onRestore?: () => void;
  restoring?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span
      data-slot="checkpoint-marker"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary shadow-xs",
        className,
      )}
    >
      <Flag className="size-3 text-primary" aria-hidden />
      <span className="max-w-[180px] truncate">{label ?? "Titik simpan"}</span>
      {timestamp ? <span className="text-muted">{timestamp}</span> : null}
      {onRestore ? (
        <button
          type="button"
          onClick={onRestore}
          disabled={disabled || restoring}
          className="ml-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary-soft disabled:opacity-50"
        >
          <RotateCcw className={cn("size-3", restoring && "animate-spin")} />
          {restoring ? "Memulihkan…" : "Pulihkan"}
        </button>
      ) : null}
    </span>
  );
}

export function CheckpointList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="checkpoint-list"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}
