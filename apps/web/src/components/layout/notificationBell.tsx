"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { useSession } from "@/lib/authClient";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationsPayload,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, string> = {
  project: "bg-blue-500/15 text-blue-400",
  community: "bg-purple-500/15 text-purple-400",
  event: "bg-amber-500/15 text-amber-400",
  system: "bg-zinc-500/15 text-zinc-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}h lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationsPayload>({ unread: 0, items: [] });
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetchNotifications();
    setData(res);
  }, []);

  useEffect(() => {
    if (session?.user?.id) load();
  }, [session?.user?.id, load]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const id = window.setInterval(load, 30_000);
    return () => window.clearInterval(id);
  }, [session?.user?.id, load]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleOpen() {
    setOpen((o) => !o);
    if (!open) load();
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    setData((d) => ({ ...d, unread: 0, items: d.items.map((n) => ({ ...n, readAt: new Date().toISOString() })) }));
  }

  async function handleItem(n: (typeof data.items)[number]) {
    if (!n.readAt) {
      await markNotificationRead(n.id);
      setData((d) => ({
        ...d,
        unread: Math.max(d.unread - 1, 0),
        items: d.items.map((x) => (x.id === n.id ? { ...x, readAt: n.readAt ?? new Date().toISOString() } : x)),
      }));
    }
    setOpen(false);
    if (n.href) router.push(n.href);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {data.unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[8px] font-bold leading-none text-white ring-2 ring-background">
            {data.unread > 9 ? "9+" : data.unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <p className="text-sm font-semibold text-text">Notifications</p>
            {data.unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          {data.items.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">Belum ada notifikasi</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {data.items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItem(n)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-surface",
                    !n.readAt && "bg-primary/[0.03]",
                  )}
                >
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", TYPE_ICONS[n.type] ?? TYPE_ICONS.system)}>
                    <Bell className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-text">{n.title}</span>
                    {n.body && <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{n.body}</span>}
                    <span className="mt-1 block text-[9px] text-muted/70">{timeAgo(n.createdAt)}</span>
                  </span>
                  {!n.readAt && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}