"use client";

import { type RefObject } from "react";
import { ListFilter, Loader2, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@santai/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AIMU_ICON_BUTTON,
  AIMU_MENU_ITEM,
  AIMU_MENU_SURFACE,
  FILTER_LABELS,
  type ChatFilter,
} from "@/components/ai/sidebarTypes";

function FilterMenu({
  filter,
  counts,
  onFilterChange,
  collapsed,
}: {
  filter: ChatFilter;
  counts: Record<ChatFilter, number>;
  onFilterChange: (filter: ChatFilter) => void;
  collapsed: boolean;
}) {
  const trigger = (
    <button
      type="button"
      aria-label={`Filter: ${FILTER_LABELS[filter]}`}
      className={cn(
        AIMU_ICON_BUTTON,
        "relative",
        filter !== "all" && "text-aimu-accent",
      )}
    >
      <ListFilter className="size-3.5" />
      {filter !== "all" && (
        <span className="absolute right-1.5 top-1.5 size-1 rounded-full bg-aimu-accent" />
      )}
    </button>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            Filter: {FILTER_LABELS[filter]}
          </TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className={cn(AIMU_MENU_SURFACE, "w-52")}
      >
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.12em] text-aimu-muted">
          Filter
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={filter}
          onValueChange={(value) => onFilterChange(value as ChatFilter)}
        >
          {(Object.keys(FILTER_LABELS) as ChatFilter[]).map((key) => (
            <DropdownMenuRadioItem key={key} value={key} className={AIMU_MENU_ITEM}>
              <span className="flex-1">{FILTER_LABELS[key]}</span>
              <span className="text-[10px] tabular-nums text-aimu-muted">
                {counts[key]}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddChatButton({
  collapsed,
  creating,
  onCreate,
}: {
  collapsed: boolean;
  creating: boolean;
  onCreate: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onCreate}
          disabled={creating}
          aria-label="Percakapan baru"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aimu-accent text-aimu-accent-ink transition hover:brightness-110 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aimu-accent/50"
        >
          {creating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side={collapsed ? "right" : "bottom"}>
        Percakapan Baru
      </TooltipContent>
    </Tooltip>
  );
}

/** Baris alat: Filter | Search | Percakapan Baru. */
export function SidebarToolbar({
  collapsed,
  filter,
  counts,
  onFilterChange,
  query,
  onQueryChange,
  onClear,
  searching,
  creating,
  onCreate,
  onExpandSearch,
  inputRef,
}: {
  collapsed: boolean;
  filter: ChatFilter;
  counts: Record<ChatFilter, number>;
  onFilterChange: (filter: ChatFilter) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  searching: boolean;
  creating: boolean;
  onCreate: () => void;
  onExpandSearch: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  if (collapsed) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1 border-b border-aimu-border py-2">
        <FilterMenu
          filter={filter}
          counts={counts}
          onFilterChange={onFilterChange}
          collapsed
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onExpandSearch}
              aria-label="Cari percakapan"
              className={AIMU_ICON_BUTTON}
            >
              <Search className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Cari (Ctrl+K)</TooltipContent>
        </Tooltip>
        <AddChatButton collapsed creating={creating} onCreate={onCreate} />
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-aimu-border px-2.5 py-2.5">
      <FilterMenu
        filter={filter}
        counts={counts}
        onFilterChange={onFilterChange}
        collapsed={false}
      />
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-aimu-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onClear();
              event.currentTarget.blur();
            }
          }}
          placeholder="Cari percakapan..."
          aria-label="Cari percakapan"
          className="h-8 w-full rounded-[10px] border border-aimu-border bg-aimu-surface pl-8 pr-7 text-[12px] text-aimu-text outline-none transition-colors placeholder:text-aimu-muted/80 focus-visible:border-aimu-accent/50 focus-visible:ring-1 focus-visible:ring-aimu-accent/30"
        />
        {searching ? (
          <Loader2 className="absolute right-2 top-1/2 size-3 -translate-y-1/2 animate-spin text-aimu-muted" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Bersihkan pencarian"
            className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-aimu-muted hover:text-aimu-text"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-aimu-border px-1 font-mono text-[9px] text-aimu-muted">
            ⌘K
          </kbd>
        )}
      </div>
      <AddChatButton collapsed={false} creating={creating} onCreate={onCreate} />
    </div>
  );
}
