"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Check, ChevronDown, Copy, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@santai/ui/collapsible";

export type ToolStatus = "pending" | "running" | "completed" | "error";

export function Tool({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="tool"
      className={cn("w-full overflow-hidden rounded-xl border border-border bg-card/60", className)}
      {...props}
    />
  );
}

export function ToolHeader({
  name,
  status = "pending",
  description,
  defaultOpen = false,
  className,
  children,
}: {
  name: string;
  status?: ToolStatus;
  description?: string;
  defaultOpen?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen || status === "running");
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-surface/60",
          className,
        )}
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted",
            status === "running" && "border-primary/30 bg-primary/10 text-primary animate-pulse",
            status === "completed" && "border-primary/30 bg-primary/10 text-primary",
            status === "error" && "border-destructive/30 bg-destructive-soft text-destructive",
          )}
        >
          <Wrench className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-text">{name}</span>
          {description ? <span className="block truncate text-[10px] text-muted">{description}</span> : null}
        </span>
        <ToolStatusLabel status={status} />
        <ChevronDown className={cn("size-3.5 shrink-0 text-muted transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      {children ? (
        <CollapsibleContent className="border-t border-border data-[state=closed]:hidden">
          {children}
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}

export function ToolStatusLabel({ status }: { status: ToolStatus }) {
  const label: Record<ToolStatus, string> = {
    pending: "Menunggu",
    running: "Berjalan",
    completed: "Selesai",
    error: "Gagal",
  };
  return (
    <span
      data-status={status}
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
        status === "running" && "bg-primary/10 text-primary",
        status === "completed" && "bg-primary-soft text-primary",
        status === "error" && "bg-destructive-soft text-destructive",
        status === "pending" && "bg-surface text-muted",
      )}
    >
      {label[status]}
    </span>
  );
}

export function ToolInput({ value, className }: { value: unknown; className?: string }) {
  return <ToolJsonBlock label="Input" value={value} className={className} />;
}

export function ToolOutput({ value, className }: { value: unknown; className?: string }) {
  return <ToolJsonBlock label="Output" value={value} className={className} />;
}

export function ToolError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("px-3 py-2 text-xs", className)}>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-destructive">Error</div>
      <pre className="overflow-auto whitespace-pre-wrap rounded-md bg-destructive-soft/40 p-2 text-[11px] text-destructive">
        {message}
      </pre>
    </div>
  );
}

function ToolJsonBlock({ label, value, className }: { label: string; value: unknown; className?: string }) {
  const [copied, setCopied] = useState(false);
  const text =
    typeof value === "string" ? value : value === undefined ? "" : JSON.stringify(value, null, 2);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className={cn("px-3 py-2", className)}>
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted">
        <span>{label}</span>
        {text ? (
          <button type="button" onClick={() => void copy()} className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-surface hover:text-text">
            {copied ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}
            {copied ? "Tersalin" : "Salin"}
          </button>
        ) : null}
      </div>
      <pre className="max-h-48 overflow-auto rounded-md bg-surface/60 p-2 text-[11px] leading-relaxed text-text-secondary">
        <code>{text || "—"}</code>
      </pre>
    </div>
  );
}
