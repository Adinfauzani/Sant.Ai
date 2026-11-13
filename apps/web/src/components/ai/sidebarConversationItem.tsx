"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Ellipsis,
  FolderInput,
  MessageSquareText,
  Pencil,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AimChatSummary } from "@/lib/ai/aimuActions";
import {
  AIMU_MENU_ITEM,
  AIMU_MENU_SURFACE,
} from "@/components/ai/sidebarTypes";

const MENU_SURFACE = `w-52 ${AIMU_MENU_SURFACE}`;
const MENU_ITEM = AIMU_MENU_ITEM;

export function SidebarConversationItem({
  chat,
  active,
  onRename,
  onTogglePin,
  onArchive,
  onRestore,
  onMoveToProject,
  onRequestDelete,
  onNavigate,
}: {
  chat: AimChatSummary;
  active: boolean;
  onRename: (id: string, title: string) => Promise<void>;
  onTogglePin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onMoveToProject: (chat: AimChatSummary) => void;
  onRequestDelete: (chat: AimChatSummary) => void;
  onNavigate?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [value, setValue] = useState(chat.title);
  const archived = Boolean(chat.archivedAt);

  const submitRename = async () => {
    const next = value.trim();
    setRenaming(false);
    if (!next || next === chat.title) return;
    await onRename(chat.id, next);
  };

  if (renaming) {
    return (
      <form
        className="flex items-center gap-1 px-1.5 py-1"
        onSubmit={(event) => {
          event.preventDefault();
          void submitRename();
        }}
      >
        <input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setRenaming(false);
          }}
          aria-label="Judul percakapan"
          className="min-w-0 flex-1 rounded-md border border-aimu-border bg-aimu-surface px-2 py-1 text-[12px] text-aimu-text outline-none focus-visible:border-aimu-accent/60 focus-visible:ring-1 focus-visible:ring-aimu-accent/40"
        />
        <button
          type="submit"
          className="rounded-md bg-aimu-accent px-2 py-1 text-[10px] font-semibold text-aimu-accent-ink"
        >
          OK
        </button>
      </form>
    );
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <div
        className={cn(
          "group/item relative rounded-[10px] transition-colors duration-150",
          active
            ? "bg-aimu-active text-aimu-text shadow-[inset_2px_0_0_0_var(--color-aimu-accent)]"
            : "text-aimu-muted hover:bg-aimu-hover hover:text-aimu-text",
        )}
        onContextMenu={(event) => {
          event.preventDefault();
          setMenuOpen(true);
        }}
      >
        <Link
          href={`/chat/${chat.id}`}
          onClick={onNavigate}
          title={chat.title}
          aria-current={active ? "page" : undefined}
          className="flex items-center gap-2 py-1.5 pl-2.5 pr-8 text-[12.5px] leading-5 outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60"
        >
          {chat.pinned ? (
            <Pin className="size-3.5 shrink-0 text-aimu-accent" />
          ) : (
            <MessageSquareText className="size-3.5 shrink-0 opacity-60" />
          )}
          <span className="truncate">{chat.title}</span>
          {archived && (
            <Archive className="ml-auto size-3 shrink-0 opacity-60" />
          )}
        </Link>

        {chat.pinned && (
          <Pin className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-aimu-accent/70 group-hover/item:hidden" />
        )}

        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Aksi untuk ${chat.title}`}
            className={cn(
              "absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-aimu-muted opacity-0 transition-opacity hover:bg-aimu-surface hover:text-aimu-text focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60 group-hover/item:opacity-100",
              menuOpen && "opacity-100",
            )}
          >
            <Ellipsis className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={6}
        className={MENU_SURFACE}
      >
        <DropdownMenuItem asChild className={MENU_ITEM}>
          <Link href={`/chat/${chat.id}`} onClick={onNavigate}>
            <MessageSquareText className="size-3.5" />
            Buka percakapan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={MENU_ITEM}
          onSelect={() => {
            setValue(chat.title);
            setRenaming(true);
          }}
        >
          <Pencil className="size-3.5" />
          Ganti nama
        </DropdownMenuItem>
        <DropdownMenuItem
          className={MENU_ITEM}
          onSelect={() => void onTogglePin(chat.id, !chat.pinned)}
        >
          {chat.pinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )}
          {chat.pinned ? "Lepas sematan" : "Sematkan"}
        </DropdownMenuItem>
        {archived ? (
          <DropdownMenuItem
            className={MENU_ITEM}
            onSelect={() => void onRestore(chat.id)}
          >
            <ArchiveRestore className="size-3.5" />
            Pulihkan
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className={MENU_ITEM}
            onSelect={() => void onArchive(chat.id)}
          >
            <Archive className="size-3.5" />
            Arsipkan
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className={MENU_ITEM}
          onSelect={() => onMoveToProject(chat)}
        >
          <FolderInput className="size-3.5" />
          Pindahkan ke proyek
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-aimu-border" />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-[12.5px] text-red-400 focus:bg-red-500/10 focus:text-red-300"
          onSelect={() => onRequestDelete(chat)}
        >
          <Trash2 className="size-3.5" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
