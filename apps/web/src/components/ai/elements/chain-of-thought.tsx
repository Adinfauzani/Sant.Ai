"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ChevronDown, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@santai/ui/collapsible";

type ChainOfThoughtContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

function useChainOfThought() {
  const ctx = useContext(ChainOfThoughtContext);
  if (!ctx) {
    throw new Error(
      "ChainOfThought components must be used within <ChainOfThought>",
    );
  }
  return ctx;
}

export type ChainOfThoughtStepStatus =
  | "pending"
  | "active"
  | "complete"
  | "error";

export function ChainOfThought({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Collapsible>, "open" | "onOpenChange"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <ChainOfThoughtContext.Provider value={{ open, setOpen }}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        data-slot="chain-of-thought"
        className={cn(
          "w-full rounded-xl border border-border bg-card/60",
          className,
        )}
        {...props}
      >
        {children}
      </Collapsible>
    </ChainOfThoughtContext.Provider>
  );
}

export function ChainOfThoughtHeader({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsibleTrigger>) {
  const { open } = useChainOfThought();
  return (
    <CollapsibleTrigger
      data-slot="chain-of-thought-header"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-text-secondary transition-colors hover:bg-surface/60",
        className,
      )}
      {...props}
    >
      <CircleDot className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1 truncate">
        {children ?? "Langkah proses"}
      </span>
      <ChevronDown
        className={cn(
          "size-3.5 shrink-0 text-muted transition-transform",
          open && "rotate-180",
        )}
        aria-hidden
      />
    </CollapsibleTrigger>
  );
}

export function ChainOfThoughtContent({
  className,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="chain-of-thought-content"
      className={cn(
        "border-t border-border px-3 py-2 data-[state=closed]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function ChainOfThoughtStep({
  status = "pending",
  label,
  description,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  status?: ChainOfThoughtStepStatus;
  label: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div
      data-slot="chain-of-thought-step"
      data-status={status}
      className={cn(
        "group/step relative flex items-start gap-2 py-1.5 text-xs",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
          status === "complete" &&
            "border-primary/40 bg-primary/10 text-primary",
          status === "active" &&
            "animate-pulse border-primary/50 bg-primary/15 text-primary",
          status === "pending" && "border-dashed border-border text-muted",
          status === "error" &&
            "border-destructive/40 bg-destructive-soft text-destructive",
        )}
      >
        {status === "complete" ? "✓" : status === "error" ? "!" : "•"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-text">{label}</div>
        {description ? (
          <div className="mt-0.5 text-[11px] leading-relaxed text-muted">
            {description}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
