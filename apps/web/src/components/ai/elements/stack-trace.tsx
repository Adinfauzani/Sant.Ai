"use client";

import { useMemo, useState, type ComponentProps } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@santai/ui/collapsible";

export interface StackFrame {
  file?: string;
  line?: number;
  column?: number;
  function?: string;
  raw?: string;
}

export function parseStackTrace(stack: string): StackFrame[] {
  return stack
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(/at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?/);
      if (!m) return { raw };
      return { function: m[1], file: m[2], line: Number(m[3]), column: Number(m[4]), raw };
    });
}

export function StackTrace({
  stack,
  title = "Jejak tumpukan",
  defaultOpen = false,
  maxFrames = 12,
  className,
  ...props
}: ComponentProps<"div"> & {
  stack: string;
  title?: string;
  defaultOpen?: boolean;
  maxFrames?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const frames = useMemo(() => parseStackTrace(stack).slice(0, maxFrames), [stack, maxFrames]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(stack);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <div
        data-slot="stack-trace"
        className={cn("w-full overflow-hidden rounded-xl border border-border bg-card/60", className)}
        {...props}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs font-medium text-text hover:text-primary">
            <ChevronDown className={cn("size-3.5 shrink-0 text-muted transition-transform", open && "rotate-180")} />
            <span className="truncate">{title}</span>
            <span className="text-[10px] font-normal text-muted">{frames.length} frame</span>
          </CollapsibleTrigger>
          <button
            type="button"
            onClick={() => void copy()}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
            aria-label="Salin jejak"
          >
            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
          </button>
        </div>
        <CollapsibleContent className="border-t border-border data-[state=closed]:hidden">
          <pre className="max-h-56 overflow-auto p-3 text-[11px] leading-relaxed text-text-secondary">
            <code>
              {frames.map((f, i) => (
                <div key={i} className="truncate font-mono">
                  {f.raw ?? `${f.function ?? "<anon>"} (${f.file}:${f.line}:${f.column})`}
                </div>
              ))}
            </code>
          </pre>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
