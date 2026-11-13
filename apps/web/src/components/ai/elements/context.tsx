"use client";

import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@santai/ui/collapsible";

export function Context({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="context"
      className={cn("w-full rounded-xl border border-border bg-card/60", className)}
      {...props}
    />
  );
}

export function ContextHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="context-header"
      className={cn("flex items-center justify-between gap-2 px-3 py-2", className)}
      {...props}
    />
  );
}

export function ContextTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="context-title"
      className={cn("text-xs font-medium text-text", className)}
      {...props}
    />
  );
}

export function ContextUsageBar({
  used,
  total,
  className,
}: {
  used: number;
  total: number;
  className?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;
  const tone = pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-warning-foreground" : "bg-primary";
  return (
    <div className={cn("w-full", className)} aria-label="Penggunaan konteks">
      <div className="mb-1 flex items-center justify-between text-[10px] text-muted">
        <span>Konteks</span>
        <span>
          {used.toLocaleString("id-ID")} / {total.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ContextDetails({
  label = "Detail konteks",
  children,
  defaultOpen = false,
  className,
}: {
  label?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className={cn("border-t border-border", className)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-text-secondary hover:bg-surface/60">
        <span>{label}</span>
        <ChevronDown className="size-3.5 text-muted transition-transform data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 text-xs text-muted data-[state=closed]:hidden">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ContextList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("space-y-1 text-[11px]", className)} {...props} />;
}

export function ContextItem({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value?: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex items-center justify-between gap-3", className)}>
      <span className="truncate text-muted">{label}</span>
      {value !== undefined ? <span className="shrink-0 text-text">{value}</span> : null}
    </li>
  );
}
