"use client";

import Link from "next/link";
import { ChevronDown, Menu, Plus, Sparkles, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Pemilih model sengaja hanya menampilkan identitas "AI MU Core". Model dasar
 * tidak pernah diekspos ke UI, dan opsi lain ditandai belum tersedia supaya
 * tidak menjanjikan kemampuan yang belum ada.
 */
function ModelMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Model AI MU"
          className="hidden h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text sm:flex"
        >
          <Sparkles className="size-3.5 text-primary" />
          <span>AI MU Core</span>
          <ChevronDown className="size-3 text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
          Model
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value="core">
          <DropdownMenuRadioItem value="core" className="text-xs">
            AI MU Core
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted">
          Segera hadir
        </DropdownMenuLabel>
        <DropdownMenuItem disabled className="text-xs">
          AI MU Deep Research
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs">
          AI MU Code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatHeader({
  title,
  busy,
  hasError,
  guest,
  onOpenDrawer,
  onNewChat,
  closeHref,
}: {
  title: string;
  busy: boolean;
  hasError: boolean;
  guest: boolean;
  onOpenDrawer: () => void;
  onNewChat: () => void;
  closeHref: string;
}) {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur-md md:px-5">
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Buka navigasi"
        title="Navigasi"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-surface hover:text-text md:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate text-[13px] font-semibold leading-5 text-text">
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">
          <span
            className={cn(
              "size-1.5 rounded-full",
              hasError
                ? "bg-destructive"
                : busy
                  ? "animate-pulse bg-warning"
                  : "bg-success",
            )}
          />
          AI MU · {hasError ? "gagal" : busy ? "berpikir" : "siap"}
        </span>
      </div>

      <ModelMenu />

      {!guest && (
        <button
          type="button"
          onClick={onNewChat}
          aria-label="Percakapan baru"
          title="Percakapan baru"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-text-secondary transition-colors hover:bg-surface hover:text-text"
        >
          <Plus className="size-4" />
        </button>
      )}

      <Link
        href={closeHref}
        aria-label="Tutup dan kembali"
        title="Tutup dan kembali"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-surface hover:text-text"
      >
        <X className="size-4" />
      </Link>
    </header>
  );
}
