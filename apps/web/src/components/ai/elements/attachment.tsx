"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AttachmentChip({
  name,
  onRemove,
  className,
}: {
  name: string;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-1.5 py-0.5",
        className,
      )}
    >
      <span className="max-w-[140px] truncate text-[11px] text-text">{name}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Hapus lampiran ${name}`}
          onClick={onRemove}
          className="flex size-4 items-center justify-center rounded text-muted transition-colors hover:text-destructive"
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

export function AttachmentList({
  names,
  onRemove,
  className,
}: {
  names: string[];
  onRemove?: (index: number) => void;
  className?: string;
}) {
  if (names.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {names.map((name, index) => (
        <AttachmentChip
          key={`${name}-${index}`}
          name={name}
          onRemove={onRemove ? () => onRemove(index) : undefined}
        />
      ))}
    </div>
  );
}
