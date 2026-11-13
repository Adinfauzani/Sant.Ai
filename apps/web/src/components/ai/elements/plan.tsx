"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { ChevronDown, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@santai/ui/collapsible";

export type PlanStepStatus = "pending" | "in-progress" | "completed" | "blocked";

export interface PlanStep {
  id: string;
  title: string;
  description?: string;
  status?: PlanStepStatus;
}

export function Plan({
  title = "Rencana",
  steps,
  defaultOpen = true,
  className,
  actions,
  ...props
}: ComponentProps<"div"> & {
  title?: ReactNode;
  steps: PlanStep[];
  defaultOpen?: boolean;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const done = steps.filter((s) => s.status === "completed").length;
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <div
        data-slot="plan"
        className={cn("w-full rounded-xl border border-border bg-card/60", className)}
        {...props}
      >
        <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-surface/60">
          <ListChecks className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium text-text">{title}</span>
          <span className="text-[10px] text-muted">
            {steps.length ? `${done}/${steps.length}` : "—"}
          </span>
          {actions}
          <ChevronDown className={cn("size-3.5 shrink-0 text-muted transition-transform", open && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-border px-3 py-2 data-[state=closed]:hidden">
          {steps.length === 0 ? (
            <p className="text-[11px] text-muted">Belum ada langkah rencana.</p>
          ) : (
            <ol className="space-y-1.5">
              {steps.map((step, i) => (
                <PlanItem key={step.id} step={step} index={i + 1} />
              ))}
            </ol>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function PlanItem({ step, index }: { step: PlanStep; index: number }) {
  const status = step.status ?? "pending";
  return (
    <li data-slot="plan-item" data-status={status} className="flex items-start gap-2 text-xs">
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
          status === "completed" && "border-primary/40 bg-primary/10 text-primary",
          status === "in-progress" && "animate-pulse border-primary/50 bg-primary/15 text-primary",
          status === "pending" && "border-border text-muted",
          status === "blocked" && "border-destructive/40 bg-destructive-soft text-destructive",
        )}
      >
        {status === "completed" ? "✓" : index}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className={cn("font-medium", status === "completed" ? "text-text-secondary" : "text-text")}>
          {step.title}
        </div>
        {step.description ? <div className="mt-0.5 text-[11px] leading-relaxed text-muted">{step.description}</div> : null}
      </div>
    </li>
  );
}

export function PlanHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="plan-header" className={cn("flex items-center gap-2", className)} {...props} />;
}

export function PlanContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="plan-content" className={cn("space-y-1.5", className)} {...props} />;
}
