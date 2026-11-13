import type { AimChatSummary } from "@/lib/ai/aimuActions";

export type ChatFilter = "all" | "pinned" | "archived" | "projects";

export const FILTER_LABELS: Record<ChatFilter, string> = {
  all: "Semua Percakapan",
  pinned: "Disematkan",
  archived: "Diarsipkan",
  projects: "Proyek",
};

/** Kelas bersama untuk menu/popover di sidebar gelap. */
export const AIMU_MENU_SURFACE =
  "border-aimu-border bg-aimu-surface text-aimu-text";
export const AIMU_MENU_ITEM =
  "cursor-pointer gap-2 text-[12.5px] text-aimu-text/90 focus:bg-aimu-hover focus:text-aimu-text";
export const AIMU_ICON_BUTTON =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-aimu-muted transition-colors hover:bg-aimu-hover hover:text-aimu-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aimu-accent/60";

export interface ChatGroup {
  label: string;
  items: AimChatSummary[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Kelompokkan percakapan berdasarkan tanggal update terakhir. */
export function groupChatsByDate(chats: AimChatSummary[]): ChatGroup[] {
  const now = new Date();
  const startToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startYesterday = startToday - DAY_MS;
  const startWeek = startToday - 7 * DAY_MS;

  const today: AimChatSummary[] = [];
  const yesterday: AimChatSummary[] = [];
  const week: AimChatSummary[] = [];
  const older: AimChatSummary[] = [];

  for (const chat of chats) {
    const time = new Date(chat.updatedAt).getTime();
    if (time >= startToday) today.push(chat);
    else if (time >= startYesterday) yesterday.push(chat);
    else if (time >= startWeek) week.push(chat);
    else older.push(chat);
  }

  return [
    { label: "Hari Ini", items: today },
    { label: "Kemarin", items: yesterday },
    { label: "7 Hari Terakhir", items: week },
    { label: "Lebih Lama", items: older },
  ].filter((group) => group.items.length > 0);
}

/** Cocokkan judul secara lokal supaya hasil server tidak "berkedip". */
export function matchesQuery(chat: AimChatSummary, query: string): boolean {
  const needle = query.trim().toLowerCase();
  return !needle || chat.title.toLowerCase().includes(needle);
}
