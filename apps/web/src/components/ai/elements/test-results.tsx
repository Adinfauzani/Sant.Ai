"use client";

import type { ComponentProps, ReactNode } from "react";
import { CheckCircle2, Clock, Loader2, MinusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestStatus = "passed" | "failed" | "skipped" | "running" | "pending";

export interface TestCaseResult {
  id: string;
  name: string;
  status: TestStatus;
  durationMs?: number;
  error?: string;
}

export function TestResults({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="test-results"
      className={cn("w-full overflow-hidden rounded-xl border border-border bg-card/60", className)}
      {...props}
    />
  );
}

export function TestResultsHeader({
  title = "Hasil pengujian",
  summary,
  className,
}: {
  title?: ReactNode;
  summary?: { passed?: number; failed?: number; skipped?: number; total?: number; durationMs?: number };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2", className)}>
      <span className="text-xs font-medium text-text">{title}</span>
      {summary ? (
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          {typeof summary.passed === "number" ? <span className="text-primary">{summary.passed} lulus</span> : null}
          {typeof summary.failed === "number" ? <span className="text-destructive">{summary.failed} gagal</span> : null}
          {typeof summary.skipped === "number" ? <span className="text-muted">{summary.skipped} lewati</span> : null}
          {typeof summary.durationMs === "number" ? (
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="size-3" />
              {summary.durationMs}ms
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function TestResultsList({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("divide-y divide-border", className)} {...props} />;
}

export function TestResultItem({ result }: { result: TestCaseResult }) {
  return (
    <li className="px-3 py-2 text-xs" data-status={result.status}>
      <div className="flex items-start gap-2">
        <TestStatusIcon status={result.status} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("truncate font-medium", result.status === "failed" ? "text-destructive" : "text-text")}>
              {result.name}
            </span>
            {typeof result.durationMs === "number" ? (
              <span className="shrink-0 text-[10px] text-muted">{result.durationMs}ms</span>
            ) : null}
          </div>
          {result.error ? (
            <pre className="mt-1 overflow-auto whitespace-pre-wrap rounded-md bg-destructive-soft/40 p-2 text-[11px] text-destructive">
              {result.error}
            </pre>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function TestStatusIcon({ status, className }: { status: TestStatus; className?: string }) {
  if (status === "passed") return <CheckCircle2 className={cn("mt-0.5 size-3.5 shrink-0 text-primary", className)} />;
  if (status === "failed") return <XCircle className={cn("mt-0.5 size-3.5 shrink-0 text-destructive", className)} />;
  if (status === "running") return <Loader2 className={cn("mt-0.5 size-3.5 shrink-0 animate-spin text-primary", className)} />;
  if (status === "skipped") return <MinusCircle className={cn("mt-0.5 size-3.5 shrink-0 text-muted", className)} />;
  return <span className={cn("mt-0.5 inline-block size-3.5 shrink-0 rounded-full border border-dashed border-border", className)} />;
}

export function TestResultsEmpty({ children = "Belum ada hasil pengujian.", className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("px-3 py-4 text-center text-xs text-muted", className)}>{children}</div>;
}
