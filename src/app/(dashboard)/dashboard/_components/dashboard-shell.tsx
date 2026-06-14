"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import {
  LayoutDashboard, BarChart3, TrendingUp, FileText, Settings, ChevronLeft,
  PanelRightClose, X, BookOpen, Shield, Globe, Smile, Hash, Radio,
  Youtube, Search, LogOut, User, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Sidebar config ──────────────────────────────── */

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon?: React.ElementType }[];
}

const sidebar: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Data Intelligence", href: "#", icon: BarChart3,
    children: [
      { label: "Overview", href: "/dashboard/data-intelligence/overview", icon: Globe },
      { label: "Literasi Digital", href: "/dashboard/data-intelligence/literasi", icon: BookOpen },
      { label: "Keamanan Digital", href: "/dashboard/data-intelligence/keamanan", icon: Shield },
      { label: "Isu Publik", href: "/dashboard/data-intelligence/isu-publik", icon: TrendingUp },
    ],
  },
  {
    label: "Analytics", href: "#", icon: TrendingUp,
    children: [
      { label: "Trends", href: "/dashboard/analytics/trends", icon: TrendingUp },
      { label: "Sentiment", href: "/dashboard/analytics/sentiment", icon: Smile },
      { label: "Keywords", href: "/dashboard/analytics/keywords", icon: Hash },
      { label: "Sources", href: "/dashboard/analytics/sources", icon: Radio },
    ],
  },
  {
    label: "Settings", href: "#", icon: Settings,
    children: [
      { label: "Articles", href: "/dashboard/content/articles", icon: FileText },
      { label: "YouTube", href: "/dashboard/content/youtube", icon: Youtube },
    ],
  },
];

/* ─── Sidebar Nav ─────────────────────────────────── */

function SidebarNav({ collapsed, onClose, sidebarItems }: { collapsed: boolean; onClose?: () => void; sidebarItems: SidebarItem[] }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(["Data Intelligence"]);

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn("flex flex-col gap-0.5", collapsed ? "items-center" : "px-2")}>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const active = item.children
          ? item.children.some((c) => isActive(c.href))
          : isActive(item.href);

        if (item.children) {
          const open = expanded.includes(item.label);
          return (
            <div key={item.label} className="w-full">
              <button
                onClick={() => toggle(item.label)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all",
                  collapsed ? "justify-center" : "",
                  active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", open && "-rotate-90")} />
                  </>
                )}
              </button>
              {open && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
                  {item.children.map((child) => {
                    const childActive = isActive(child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all",
                          childActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted hover:text-text",
                        )}
                      >
                        {ChildIcon && <ChildIcon className="h-3 w-3 shrink-0" />}
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all",
              collapsed ? "justify-center" : "",
              active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface hover:text-text",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Dashboard Shell ──────────────────────────────── */

export function DashboardShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userAvatar = session.user?.image;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden border-r border-border bg-surface/30 backdrop-blur-sm md:flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div className={cn("flex items-center border-b border-border px-4 py-3", collapsed && "justify-center")}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                S
              </div>
              <div>
                <p className="text-xs font-bold text-text">Dashboard</p>
                <p className="text-[7px] uppercase tracking-widest text-muted">Command Center</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-text"
          >
            <PanelRightClose className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav collapsed={collapsed} sidebarItems={sidebar} />
        </div>

        {!collapsed && (
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-[10px] font-medium text-text">{session.user?.name || "User"}</p>
                <p className="truncate text-[8px] text-muted">{session.user?.email || ""}</p>
              </div>
              <Link href="/" className="flex h-5 w-5 items-center justify-center rounded text-muted hover:text-text">
                <LogOut className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] animate-in slide-in-from-left duration-200 border-r border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  S
                </div>
                <p className="text-xs font-bold text-text">Dashboard</p>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-surface/50 px-3 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 truncate">
                <p className="text-[10px] font-medium text-text">{session.user?.name || "User"}</p>
                <p className="truncate text-[8px] text-muted">{session.user?.email || ""}</p>
              </div>
            </div>
            <SidebarNav collapsed={false} onClose={() => setMobileOpen(false)} sidebarItems={sidebar} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-text md:hidden"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/30 px-3 py-1.5 text-xs text-muted">
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline">Search dashboard...</span>
          </div>

          <div className="flex-1" />

          <Link
            href="/dashboard/account"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface/30 px-2 py-1.5 text-xs text-text transition-colors hover:border-primary/30"
            aria-label="Account"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={session.user?.name || "User avatar"} className="h-6 w-6 rounded-md object-cover" />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1 text-[10px] text-muted transition-colors hover:text-text"
          >
            <Home className="h-3 w-3" />
            Main Site
          </Link>
        </div>

        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
