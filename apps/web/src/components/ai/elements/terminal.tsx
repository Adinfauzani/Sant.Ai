"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Check, Copy, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Terminal({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-[color-mix(in_oklab,var(--bg-base)_92%,black)] text-[12px] font-mono",
        className,
      )}
      {...props}
    />
  );
}

export function TerminalHeader({
  title = "Terminal",
  onClear,
  className,
}: {
  title?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <div
      data-slot="terminal-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border bg-surface/60 px-3 py-1.5 text-[11px] text-text-secondary",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <TerminalSquare className="size-3.5" />
        {title}
      </span>
      {onClear ? (
        <button type="button" onClick={onClear} className="rounded px-1.5 py-0.5 hover:bg-surface hover:text-text">
          Bersihkan
        </button>
      ) : null}
    </div>
  );
}

export function TerminalOutput({
  lines,
  autoScroll = true,
  className,
}: {
  lines: string[];
  autoScroll?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!autoScroll || !ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, autoScroll]);

  return (
    <div ref={ref} className={cn("max-h-64 overflow-auto p-3 leading-relaxed text-text-secondary", className)}>
      {lines.length === 0 ? (
        <span className="text-muted">Tidak ada keluaran.</span>
      ) : (
        lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))
      )}
    </div>
  );
}

export function TerminalCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className={cn("flex items-center gap-2 border-t border-border bg-surface/40 px-3 py-2", className)}>
      <span className="text-primary">$</span>
      <code className="min-w-0 flex-1 truncate text-text">{command}</code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label="Salin perintah"
        className="flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
