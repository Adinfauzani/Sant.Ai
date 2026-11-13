"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, PanelLeftClose } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@santai/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/authClient";
import { useIsMobile } from "@santai/ui/use-mobile";
import { searchAimChats, type AimChatSummary } from "@/lib/ai/aimuActions";
import type { ChatFilter } from "@/components/ai/sidebarTypes";
import { SidebarToolbar } from "@/components/ai/sidebarToolbar";
import { SidebarNav } from "@/components/ai/sidebarNav";
import { SidebarSections } from "@/components/ai/sidebarSections";
import { SidebarProfileMenu } from "@/components/ai/sidebarProfileMenu";
import {
  DeleteChatDialog,
  MoveToProjectDialog,
} from "@/components/ai/sidebarDialogs";
import pkg from "../../../package.json";

export type { AimChatSummary };

export function AiChatSidebar({
  chats,
  activeChatId,
  collapsed,
  onToggleCollapsed,
  onCreateChat,
  onRename,
  onDelete,
  onTogglePin,
  onArchive,
  onRestore,
  onMoveToProject,
  onNavigate,
}: {
  chats: AimChatSummary[];
  activeChatId?: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCreateChat: () => void | Promise<void>;
  onRename: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePin: (id: string, pinned: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onMoveToProject: (id: string, projectId: string | null) => Promise<void>;
  onNavigate?: () => void;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name?.trim() || "Sahabat Santai";
  const userEmail = user?.email ?? "";
  const username =
    (user as { username?: string | null } | undefined)?.username ?? undefined;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AimChatSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [creating, setCreating] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<AimChatSummary | null>(null);
  const [chatForProject, setChatForProject] = useState<AimChatSummary | null>(
    null,
  );
  const searchRef = useRef<HTMLInputElement>(null);

  const isCollapsed = collapsed && !isMobile;
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!trimmedQuery) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    let active = true;
    const timer = setTimeout(() => {
      searchAimChats(trimmedQuery)
        .then((items) => {
          if (active) setResults(items);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 220);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  const expandAndFocus = () => {
    if (isCollapsed) onToggleCollapsed();
    window.setTimeout(() => searchRef.current?.focus(), 220);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        expandAndFocus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  const counts = useMemo<Record<ChatFilter, number>>(
    () => ({
      all: chats.filter((chat) => !chat.archivedAt).length,
      pinned: chats.filter((chat) => !chat.archivedAt && chat.pinned).length,
      archived: chats.filter((chat) => Boolean(chat.archivedAt)).length,
      projects: chats.filter((chat) => !chat.archivedAt && Boolean(chat.projectId))
        .length,
    }),
    [chats],
  );

  const createChat = async () => {
    if (creating) return;
    setCreating(true);
    try {
      await onCreateChat();
    } finally {
      setCreating(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full min-h-0 w-full flex-col bg-aimu-bg text-aimu-text">
        {/* Header */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-2.5 border-b border-aimu-border px-3 py-3",
            isCollapsed && "justify-center px-0",
          )}
        >
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapsed}
                  aria-label="Perluas sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-aimu-accent-soft text-aimu-accent ring-1 ring-aimu-accent/20 transition-colors hover:bg-aimu-hover"
                >
                  <Bot className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Perluas sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-aimu-accent-soft text-aimu-accent ring-1 ring-aimu-accent/20">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[13px] font-extrabold tracking-tight text-aimu-text">
                    AI MU
                  </p>
                  <span className="rounded border border-aimu-border bg-aimu-surface px-1 py-px text-[9px] font-semibold tabular-nums text-aimu-muted">
                    v{pkg.version}
                  </span>
                </div>
                <p className="truncate text-[10px] leading-tight text-aimu-muted">
                  Santai Intelligent Engine
                </p>
              </div>
              {!isMobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onToggleCollapsed}
                      aria-label="Ciutkan sidebar"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] text-aimu-muted transition-colors hover:bg-aimu-hover hover:text-aimu-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60"
                    >
                      <PanelLeftClose className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Ciutkan sidebar</TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </div>

        <SidebarToolbar
          collapsed={isCollapsed}
          filter={filter}
          counts={counts}
          onFilterChange={setFilter}
          query={query}
          onQueryChange={setQuery}
          onClear={() => setQuery("")}
          searching={searching}
          creating={creating}
          onCreate={() => void createChat()}
          onExpandSearch={expandAndFocus}
          inputRef={searchRef}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3 [scrollbar-color:var(--color-aimu-border)_transparent] [scrollbar-width:thin]">
          <SidebarNav
            collapsed={isCollapsed}
            pathname={pathname}
            filter={filter}
            onFilterChange={setFilter}
            onToggleCollapsed={onToggleCollapsed}
            onNavigate={onNavigate}
          />

          {!isCollapsed && (
            <SidebarSections
              chats={chats}
              results={results}
              query={query}
              filter={filter}
              activeChatId={activeChatId}
              onNavigate={onNavigate}
              onRename={onRename}
              onTogglePin={onTogglePin}
              onArchive={onArchive}
              onRestore={onRestore}
              onMoveToProject={setChatForProject}
              onRequestDelete={setChatToDelete}
              onManagePinned={() => setFilter("pinned")}
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-aimu-border p-2">
          <SidebarProfileMenu
            collapsed={isCollapsed}
            name={userName}
            email={userEmail || "Santai Intelligent Member"}
            username={username}
          />
        </div>
      </div>

      {chatToDelete && (
        <DeleteChatDialog
          chat={chatToDelete}
          onCancel={() => setChatToDelete(null)}
          onConfirm={async () => {
            await onDelete(chatToDelete.id);
            setChatToDelete(null);
          }}
        />
      )}

      {chatForProject && (
        <MoveToProjectDialog
          chat={chatForProject}
          onCancel={() => setChatForProject(null)}
          onSave={async (projectId) => {
            await onMoveToProject(chatForProject.id, projectId);
            setChatForProject(null);
          }}
        />
      )}
    </TooltipProvider>
  );
}
