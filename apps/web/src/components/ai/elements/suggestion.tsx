"use client";

import { cn } from "@/lib/utils";

export function SuggestionList({
  items,
  onSelect,
  disabled,
  className,
}: {
  items: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {items.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-text disabled:opacity-40"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
