"use client";

import Link from "next/link";
import { Bookmark, BookOpen, Compass, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@santai/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ChatFilter } from "@/components/ai/sidebarTypes";

const NAV_ITEMS = [
  { href: "/chat", label: "Beranda", icon: Home, match: /^\/chat(?:\/|$)/ },
  { href: "/ai", label: "Eksplorasi Mode", icon: Compass, match: /^\/ai(?:\/|$)/ },
  {
    href: "/showcase",
    label: "Pustaka Proyek",
    icon: BookOpen,
    match: /^\/showcase(?:\/|$)/,
  },
] as const;

/** Navigasi workspace: Beranda, Eksplorasi Mode, Pustaka Proyek, Tersimpan. */
export function SidebarNav({
  collapsed,
  pathname,
  filter,
  onFilterChange,
  onToggleCollapsed,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string | null;
  filter: ChatFilter;
  onFilterChange: (filter: ChatFilter) => void;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
}) {
  const itemClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2.5 rounded-[10px] py-2 text-[12.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60",
      collapsed ? "justify-center px-0" : "px-2.5",
      active
        ? "bg-aimu-active text-aimu-text"
        : "text-aimu-muted hover:bg-aimu-hover hover:text-aimu-text",
    );

  const savedActive = filter === "pinned";
  const savedButton = (
    <button
      type="button"
      onClick={() => {
        if (collapsed) onToggleCollapsed();
        onFilterChange(savedActive ? "all" : "pinned");
      }}
      aria-pressed={savedActive}
      className={itemClass(savedActive)}
    >
      <Bookmark className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">Tersimpan</span>}
    </button>
  );

  return (
    <nav className="space-y-0.5 pt-2" aria-label="Navigasi AI MU">
      {NAV_ITEMS.map((item) => {
        const active = item.match.test(pathname ?? "");
        const link = (
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={itemClass(active)}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
        return collapsed ? (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          <span key={item.href} className="block">
            {link}
          </span>
        );
      })}

      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{savedButton}</TooltipTrigger>
          <TooltipContent side="right">Tersimpan</TooltipContent>
        </Tooltip>
      ) : (
        savedButton
      )}
    </nav>
  );
}
