"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Calendar,
  User,
  MessageSquare,
  BookOpen,
  Brain,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/authClient";
import AimuAnimatedFace from "@/components/ai/aimuAnimatedFace";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
  center?: boolean;
}

const aiShortcuts = [
  { label: "New Chat", icon: MessageSquare, href: "/ai" },
  { label: "Study Mode", icon: BookOpen, href: "/ai?mode=study" },
  { label: "AI Workspace", icon: Brain, href: "/ai?mode=workspace" },
  { label: "Summarize", icon: FileText, href: "/ai?mode=summarize" },
  { label: "Recent Chats", icon: Clock, href: "/ai?history=true" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [longPress, setLongPress] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  const username = (session?.user as { username?: string } | undefined)
    ?.username;
  const isLoggedIn = !!session?.user;

  const items: NavItem[] = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      key: "about",
      label: "About",
      href: "/about",
      icon: BookOpen,
      active: pathname === "/about",
    },
    {
      key: "ai",
      center: true,
      label: "AI MU",
      href: "/ai",
      icon: AimuAnimatedFace,
      active: pathname.startsWith("/ai"),
    },
    {
      key: "community",
      label: "Community",
      href: "/community",
      icon: Globe,
      active: pathname.startsWith("/community"),
    },
    {
      key: "profile",
      label: isLoggedIn ? "Profile" : "Sign In",
      href: isLoggedIn
        ? username
          ? `/${username}`
          : "/profile"
        : "/login",
      icon: User,
      active: isLoggedIn
        ? !!(username && pathname === `/${username}`) || pathname === "/profile"
        : false,
    },
  ];

  const handleLongPressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setLongPress(true);
    }, 500);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  useEffect(() => {
    setLongPress(false);
  }, [pathname]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div
        className="mx-3 mb-2 rounded-2xl border border-neutral-200 bg-card shadow-sm backdrop-blur-sm"
        style={{
          paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="grid grid-cols-5 items-center px-1 pt-3 pb-1.5">
          {items.map((item) => {
            if (item.center) {
              return (
                <div
                  key={item.key}
                  className="relative flex flex-col items-center justify-center"
                  onTouchStart={handleLongPressStart}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={handleLongPressStart}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                >
                  <Link
                    href={item.href}
                    className="-mt-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-md ring-2 ring-card transition-all duration-150 active:scale-95"
                    aria-label={item.label}
                  >
                    <AimuAnimatedFace />
                  </Link>

                  {longPress && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setLongPress(false)}
                      />
                      <div className="absolute bottom-full left-1/2 z-50 mb-3 w-44 -translate-x-1/2 rounded-xl border border-neutral-200 bg-card p-1.5 shadow-lg">
                        <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          AI MU
                        </p>
                        <div className="border-t border-border" />
                        {aiShortcuts.map((s) => (
                          <Link
                            key={s.label}
                            href={s.href}
                            onClick={() => setLongPress(false)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text transition-colors hover:bg-surface"
                          >
                            <s.icon className="h-3.5 w-3.5 text-primary" />
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-150 active:scale-95",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-text",
                )}
                aria-label={item.label}
                aria-current={item.active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-150",
                    item.active && "scale-105",
                  )}
                  strokeWidth={item.active ? 2.5 : 2}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
