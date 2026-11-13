"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { cn } from "./utils"

/**
 * Trace menampilkan aktivitas yang benar-benar bisa diamati pengguna:
 * langkah pemrosesan, pencarian sumber, dan progres tugas. Bukan alasan
 * internal model.
 */
export type TraceStatus = "default" | "running" | "pending" | "error"

const LINE_CLASS =
  "group/trace-line relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 pb-3 last:pb-0 before:absolute before:left-[11px] before:top-7 before:h-[calc(100%-1.75rem)] before:w-px before:bg-border before:content-[''] last:before:hidden"

const ICON_CLASS =
  "relative z-[1] row-span-2 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors [&>svg]:size-3.5 group-data-[status=default]/trace-line:text-success group-data-[status=running]/trace-line:border-primary/35 group-data-[status=running]/trace-line:bg-primary/10 group-data-[status=running]/trace-line:text-primary group-data-[status=running]/trace-line:animate-pulse group-data-[status=pending]/trace-line:border-dashed group-data-[status=pending]/trace-line:bg-transparent group-data-[status=pending]/trace-line:text-muted group-data-[status=error]/trace-line:border-destructive/40 group-data-[status=error]/trace-line:bg-destructive-soft group-data-[status=error]/trace-line:text-destructive"

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="trace"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TraceLine({
  status = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { status?: TraceStatus }) {
  return (
    <div
      role="listitem"
      data-slot="trace-line"
      data-status={status}
      className={cn(LINE_CLASS, className)}
      {...props}
    />
  )
}

function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="trace-icon"
      className={cn(ICON_CLASS, className)}
      {...props}
    />
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn(
        "col-start-2 text-[12.5px] font-medium leading-5 text-text",
        className
      )}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "col-start-2 text-[11.5px] leading-5 text-muted",
        className
      )}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible
      role="listitem"
      data-slot="trace-collapsible"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  status = "default",
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & { status?: TraceStatus }) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      data-status={status}
      className={cn(
        LINE_CLASS,
        "group/trace-trigger w-full rounded-md pr-6 text-left outline-none transition-colors hover:bg-surface/40 focus-visible:ring-2 focus-visible:ring-ring/30",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="absolute right-1 top-1.5 size-3.5 shrink-0 text-muted transition-transform duration-150 group-data-[state=open]/trace-trigger:rotate-180"
      />
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className={cn(
        "ml-9 border-l border-border pb-2 pl-3 text-[11.5px] leading-5 text-muted data-[state=closed]:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
