"use client";

import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@santai/ui/collapsible";

export type TraceLineStatus = "default" | "running" | "pending" | "error";

const LINE_CLASS =
  "group/trace-line relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2.5 gap-y-0.5 pb-2.5 last:pb-0 before:absolute before:left-[11px] before:top-6 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border before:content-[''] last:before:hidden";

const ICON_CLASS =
  "relative z-[1] row-span-2 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted transition-colors [&>svg]:size-3.5 group-data-[status=running]/trace-line:animate-pulse group-data-[status=running]/trace-line:border-primary/40 group-data-[status=running]/trace-line:bg-primary/10 group-data-[status=running]/trace-line:text-primary group-data-[status=pending]/trace-line:border-dashed group-data-[status=pending]/trace-line:text-muted group-data-[status=error]/trace-line:border-destructive/40 group-data-[status=error]/trace-line:bg-destructive-soft group-data-[status=error]/trace-line:text-destructive group-data-[status=default]/trace-line:text-text-secondary";

export function Trace({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="trace"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  );
}

export function TraceLine({
  status = "default",
  className,
  ...props
}: ComponentProps<"div"> & { status?: TraceLineStatus }) {
  return (
    <div
      role="listitem"
      data-slot="trace-line"
      data-status={status}
      className={cn(LINE_CLASS, className)}
      {...props}
    />
  );
}

export function TraceIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="trace-icon"
      className={cn(ICON_CLASS, className)}
      {...props}
    />
  );
}

export function TraceTitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn("col-start-2 min-w-0 text-[12.5px] font-medium leading-5 text-text", className)}
      {...props}
    />
  );
}

export function TraceDescription({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn("col-start-2 min-w-0 text-[11.5px] leading-5 text-muted", className)}
      {...props}
    />
  );
}

export function TraceCollapsible({
  className,
  defaultOpen,
  open,
  onOpenChange,
  ...props
}: ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible
      role="listitem"
      data-slot="trace-collapsible"
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("relative", className)}
      {...props}
    />
  );
}

export function TraceCollapsibleTrigger({
  status = "default",
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsibleTrigger> & { status?: TraceLineStatus }) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      data-status={status}
      className={cn(
        LINE_CLASS,
        "group/trace-trigger w-full rounded-md pr-6 text-left outline-none transition-colors hover:bg-surface/40 focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="absolute right-1 top-1.5 size-3.5 shrink-0 text-muted transition-transform duration-150 group-data-[state=open]/trace-trigger:rotate-180"
      />
    </CollapsibleTrigger>
  );
}

export function TraceCollapsibleContent({
  className,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className={cn(
        "ml-[34px] border-l border-border pb-2 pl-3 text-[11.5px] leading-5 text-muted data-[state=closed]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Collapsible trace row that auto-expands while running (unless the user has
 * manually toggled it), to surface in-progress details without fighting user intent.
 */
export function TraceAutoCollapsible({
  status = "default",
  autoExpandWhenRunning = false,
  className,
  children,
  content,
}: {
  status?: TraceLineStatus;
  autoExpandWhenRunning?: boolean;
  className?: string;
  children: ReactNode;
  content: ReactNode;
}) {
  const [open, setOpen] = useState(autoExpandWhenRunning && status === "running");
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    if (!autoExpandWhenRunning || userSet) return;
    if (status === "running") setOpen(true);
  }, [status, autoExpandWhenRunning, userSet]);

  return (
    <TraceCollapsible
      open={open}
      onOpenChange={(next) => {
        setUserSet(true);
        setOpen(next);
      }}
      className={className}
    >
      <TraceCollapsibleTrigger status={status}>{children}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{content}</TraceCollapsibleContent>
    </TraceCollapsible>
  );
}
