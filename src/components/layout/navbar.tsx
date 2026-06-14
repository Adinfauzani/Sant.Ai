"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Search, Bell, Menu, X, ChevronDown, LogOut, User, LayoutDashboard,
  FolderKanban, Settings, Sparkles, Home, Users, CalendarRange,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Config ────────────────────────────────────────── */

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Showcase", href: "/showcase", icon: Sparkles },
  { label: "Community", href: "/community", icon: Users },
  { label: "Events", href: "/events", icon: CalendarRange },
  { label: "Data Intelligence", href: "/intelligence", icon: BarChart3 },
];

const profileMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Projects", href: "/showcase", icon: FolderKanban },
  { label: "My Community", href: "/community", icon: Users },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Settings", href: "#", icon: Settings },
];

/* ─── Sub-components ────────────────────────────────── */

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
        <span className="text-sm font-bold text-white">S</span>
      </div>
      <div className="hidden sm:block">
        <span className="block text-[13px] font-bold leading-tight text-text">
          Sains &amp; Technology
        </span>
        <span className="block text-[8px] font-medium tracking-[0.2em] text-muted uppercase">
          Campus Tech Ecosystem
        </span>
      </div>
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all duration-200",
        isActive ? "text-text" : "text-muted hover:text-text",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
          isActive
            ? "w-5 opacity-100"
            : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100",
        )}
      />
    </Link>
  );
}

/* ─── Main Navbar ───────────────────────────────────── */

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <header className="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl md:h-16">
        <div className="container-main flex h-full items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 rounded-2xl border border-border/50 bg-surface/50 px-2 py-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                isActive={isActive(link.href)}
              />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-all hover:bg-surface hover:text-text md:h-9 md:w-9"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-all hover:bg-surface hover:text-text md:h-9 md:w-9"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-surface/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold text-text">Notifications</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: FolderKanban, text: "New project invitation: Smart Campus", time: "2m ago" },
                      { icon: Users, text: "Aulia mentioned you in AI Research Club", time: "1h ago" },
                      { icon: CalendarRange, text: "Hackathon Sains & Tech starts in 3 days", time: "5h ago" },
                      { icon: Users, text: "Collaboration request from Bunga Citra", time: "1d ago" },
                    ].map((n, i) => (
                      <button
                        key={i}
                        onClick={() => setNotifOpen(false)}
                        className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-primary/5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <n.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-text leading-snug">{n.text}</p>
                          <p className="text-[10px] text-muted mt-0.5">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border px-3 py-2">
                    <button className="w-full text-center text-[10px] text-primary transition-colors hover:text-primary/80">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {session?.user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg p-1 transition-all hover:bg-surface"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-sm md:h-8 md:w-8">
                    {userInitial}
                  </div>
                  <ChevronDown className={cn("hidden h-3.5 w-3.5 text-muted transition-transform duration-200 sm:block", profileOpen && "rotate-180")} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
                    <div className="border-b border-border px-3 py-2.5">
                      <p className="text-sm font-semibold text-text">{session.user.name}</p>
                      <p className="text-[11px] text-muted">{session.user.email}</p>
                    </div>
                    <div className="py-1">
                      {profileMenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition-all hover:bg-primary/5 hover:text-text"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border pt-1">
                      <form
                        action={async () => {
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-8 px-4 text-xs shadow-sm">Get Started</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-all hover:bg-surface hover:text-text md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/60 pt-20 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200 px-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/30">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-4 w-4 text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search projects, communities, events, members, or data insights..."
                  className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="rounded-lg border border-border px-2 py-1 text-[10px] text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  ESC
                </button>
              </div>
              <div className="grid grid-cols-3 gap-px bg-border/50">
                {[
                  { icon: FolderKanban, label: "Projects", desc: "45+ projects" },
                  { icon: Users, label: "Communities", desc: "6 communities" },
                  { icon: BarChart3, label: "Intelligence", desc: "Data insights" },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 bg-surface px-4 py-3 text-left transition-colors hover:bg-primary/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text">{s.label}</p>
                      <p className="text-[10px] text-muted">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[280px] animate-in slide-in-from-right duration-200 border-l border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-background hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-0.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  isActive={isActive(link.href)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="my-4 h-px bg-border" />

            {session?.user ? (
              <div className="space-y-0.5">
                {profileMenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition-all hover:bg-background hover:text-text"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <form
                  action={async () => {
                    await signOut({ redirectTo: "/" });
                    setMobileOpen(false);
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition-all hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-xs">Sign In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full text-xs">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
