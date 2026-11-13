"use client";

import { type ComponentProps } from "react";
import { Check, ChevronDown, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";

export type ModelOption = {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  disabled?: boolean;
  badge?: string;
};

export function ModelSelector({
  models,
  value,
  onValueChange,
  disabled,
  label = "Model",
  className,
}: {
  models: ModelOption[];
  value?: string;
  onValueChange?: (id: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const active = models.find((m) => m.id === value) ?? models[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={label}
          className={cn(
            "flex h-8 min-w-0 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text disabled:opacity-50",
            className,
          )}
        >
          <Cpu className="size-3.5 shrink-0" />
          <span className="max-w-[140px] truncate">{active?.name ?? label}</span>
          <ChevronDown className="size-3 shrink-0 text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((model) => {
          const selected = model.id === (active?.id ?? value);
          const isDisabled = disabled || model.disabled;
          return (
            <DropdownMenuItem
              key={model.id}
              disabled={isDisabled}
              onSelect={() => {
                if (isDisabled) return;
                onValueChange?.(model.id);
              }}
              className="text-xs"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="truncate">{model.name}</span>
                  {model.badge ? (
                    <span className="rounded-full border border-border bg-surface px-1.5 py-px text-[9px] text-muted">
                      {model.badge}
                    </span>
                  ) : null}
                </span>
                {model.description || model.provider ? (
                  <span className="truncate text-[10px] text-muted">
                    {[model.provider, model.description].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </span>
              {selected ? <Check className="ml-2 size-3.5 shrink-0 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModelBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="model-badge"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}
