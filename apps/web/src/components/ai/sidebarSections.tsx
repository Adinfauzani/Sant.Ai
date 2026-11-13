"use client";

import { useMemo } from "react";
import type { AimChatSummary } from "@/lib/ai/aimuActions";
import {
  groupChatsByDate,
  matchesQuery,
  type ChatFilter,
} from "@/components/ai/sidebarTypes";
import { SidebarConversationItem } from "@/components/ai/sidebarConversationItem";

function SectionLabel({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-2.5 pb-1 pt-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aimu-muted/80">
        {children}
      </p>
      {action}
    </div>
  );
}

/** Bagian PINNED + RECENT CHATS, sudah difilter sesuai toolbar. */
export function SidebarSections({
  chats,
  results,
  query,
  filter,
  activeChatId,
  onNavigate,
  onRename,
  onTogglePin,
  onArchive,
  onRestore,
  onMoveToProject,
  onRequestDelete,
  onManagePinned,
}: {
  chats: AimChatSummary[];
  results: AimChatSummary[] | null;
  query: string;
  filter: ChatFilter;
  activeChatId?: string;
  onNavigate?: () => void;
  onRename: (id: string, title: string) => Promise<void>;
  onTogglePin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onMoveToProject: (chat: AimChatSummary) => void;
  onRequestDelete: (chat: AimChatSummary) => void;
  onManagePinned: () => void;
}) {
  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    const base =
      trimmedQuery && results
        ? results
        : trimmedQuery
          ? chats.filter((chat) => matchesQuery(chat, trimmedQuery))
          : chats;
    return base.filter((chat) => {
      if (filter === "archived") return Boolean(chat.archivedAt);
      if (chat.archivedAt) return false;
      if (filter === "pinned") return chat.pinned;
      if (filter === "projects") return Boolean(chat.projectId);
      return true;
    });
  }, [chats, results, filter, trimmedQuery]);

  const pinnedChats =
    filter === "all"
      ? filtered.filter((chat) => chat.pinned)
      : filter === "pinned"
        ? filtered
        : [];
  const recentChats =
    filter === "all"
      ? filtered.filter((chat) => !chat.pinned)
      : filter === "pinned"
        ? []
        : filtered;
  const groups = useMemo(() => groupChatsByDate(recentChats), [recentChats]);

  const emptyLabel = trimmedQuery
    ? "Tidak ada percakapan yang cocok."
    : filter === "archived"
      ? "Belum ada percakapan diarsipkan."
      : filter === "projects"
        ? "Belum ada percakapan yang ditautkan ke proyek."
        : filter === "pinned"
          ? "Belum ada percakapan yang disematkan."
          : "Belum ada percakapan.";

  const renderItem = (chat: AimChatSummary) => (
    <SidebarConversationItem
      key={chat.id}
      chat={chat}
      active={chat.id === activeChatId}
      onRename={onRename}
      onTogglePin={onTogglePin}
      onArchive={onArchive}
      onRestore={onRestore}
      onMoveToProject={onMoveToProject}
      onRequestDelete={onRequestDelete}
      onNavigate={onNavigate}
    />
  );

  return (
    <>
      {(filter === "all" || filter === "pinned") && (
        <div className="mt-3">
          <SectionLabel
            action={
              pinnedChats.length > 0 ? (
                <button
                  type="button"
                  onClick={onManagePinned}
                  className="text-[10px] font-medium text-aimu-muted transition-colors hover:text-aimu-accent"
                >
                  Kelola
                </button>
              ) : null
            }
          >
            Pinned
          </SectionLabel>
          {pinnedChats.length > 0 ? (
            <div className="space-y-0.5">{pinnedChats.map(renderItem)}</div>
          ) : (
            <p className="px-2.5 py-1 text-[11px] leading-relaxed text-aimu-muted/70">
              {filter === "pinned"
                ? "Belum ada percakapan yang disematkan."
                : "Semati percakapan agar selalu di atas."}
            </p>
          )}
        </div>
      )}

      {filter !== "pinned" && (
        <div className="mt-2">
          <SectionLabel>Recent Chats</SectionLabel>
          {groups.length === 0 ? (
            <p className="px-2.5 py-1 text-[11px] leading-relaxed text-aimu-muted/70">
              {emptyLabel}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-2">
                <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-medium text-aimu-muted/70">
                  {group.label}
                </p>
                <div className="space-y-0.5">{group.items.map(renderItem)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
