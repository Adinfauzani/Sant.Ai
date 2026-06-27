"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Sparkles,
  BookOpen,
  User,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/authClient";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  center?: boolean;
}

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
      key: "community",
      label: "Community",
      href: "/community",
      icon: Globe,
      active: pathname.startsWith("/community"),
    },
    {
      key: "ai",
      center: true,
      label: "AI",
      href: isLoggedIn ? "/ai" : "/login",
      icon: Sparkles,
      active: isLoggedIn ? pathname.startsWith("/ai") : false,
    },
    {
      key: "showcase",
      label: "Showcase",
      href: "/showcase",
      icon: BookOpen,
      active: pathname.startsWith("/showcase"),
    },
    {
      key: "profile",
      label: isLoggedIn ? "Profile" : "Events",
      href: isLoggedIn
        ? username
          ? `/${username}`
          : "/profile"
        : "/login",
      icon: isLoggedIn ? User : Calendar,
      active: isLoggedIn
        ? !!(username && pathname === `/${username}`) || pathname === "/profile"
        : false,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div
        className="flex items-start justify-around rounded-t-3xl border-t border-border/50 bg-background/80 px-3 pt-3 shadow-sm backdrop-blur-xl"
        style={{
          paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {items.map((item) => {
          if (item.center) {
            return (
              <div
                key={item.key}
                className="relative flex flex-col items-center"
              >
                <Link
                  href={item.href}
                  className="-mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Artificial Intelligence"
                >
                  <Sparkles className="h-6 w-6" />
                </Link>
              </div>
            );
          }

          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all duration-200",
                item.active
                  ? "text-primary"
                  : "text-muted hover:text-text",
              )}
              aria-label={item.label}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  item.active && "scale-110",
                )}
                strokeWidth={item.active ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
