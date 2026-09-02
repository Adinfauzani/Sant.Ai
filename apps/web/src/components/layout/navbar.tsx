"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/authClient";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@santai/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@santai/ui/avatar";
import { getAvatarUrl } from "@/lib/gravatar";
import { useTheme } from "@/components/shared/themeProvider";
import { ScientificBackground } from "@santai/ui/scientificBackground";
import MobileNav from "@/components/layout/mobileNav";
import MoresNavDropdown from "@/components/layout/moresNavDropdown";
import NotificationBell from "@/components/layout/notificationBell";
import AiMuNavButton from "@/components/layout/aiMuNavButton";

const ALLOWED_DASHBOARD = new Set(["Sudo", "Admin", "Moderator"]);

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle: toggleTheme } = useTheme();
  const [avatarSrc, setAvatarSrc] = useState<string>("");

  useEffect(() => {
    const u = session?.user as any;
    if (u?.image) {
      setAvatarSrc(u.image);
      return;
    }
    if (u?.email) {
      setAvatarSrc(getAvatarUrl(u.email, 160));
    }
  }, [session]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Showcase", href: "/showcase" },
    { label: "Community", href: "/community" },
    ...(session?.user
      ? [
          { label: "People", href: "/people" },
          { label: "Hub", href: "/hub" },
        ]
      : []),
    ...(session?.user && ALLOWED_DASHBOARD.has((session.user as any).role)
      ? [{ label: "Dashboard", href: "/dashboard" }]
      : []),
  ];

  const mores = [
    { label: "Events", href: "/events" },
    { label: "AI MU", href: "/ai" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md hidden md:block">
        <ScientificBackground variant="grid" className="absolute inset-0 opacity-40" />
        <div className="container-main relative flex h-14 items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/assets/Sant.ai.png" alt="Sant.Ai" width={28} height={28} className="h-7 w-7 rounded-md" />
          <span className="text-sm font-semibold text-text">Sant.Ai</span>
        </Link>

        <nav className="hidden items-center gap-0 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 text-sm transition-colors",
                isActive(link.href) ? "text-text" : "text-muted hover:text-text",
              )}
            >
              {link.label}
            </Link>
          ))}
          <MoresNavDropdown items={mores} />
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Toggle tema"
            className="relative flex h-7 w-[60px] items-center rounded-full border border-border bg-surface px-1 text-muted transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SunIcon className="pointer-events-none absolute left-1.5 h-4 w-4 text-amber-400" />
            <MoonIcon className="pointer-events-none absolute right-1.5 h-4 w-4 text-indigo-300" />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-background shadow-sm ring-1 ring-black/5 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${theme === "dark" ? "translate-x-[32px]" : "translate-x-0"}`}
            />
          </button>

          {session?.user && (
            <>
              <AiMuNavButton />
              <NotificationBell />

              <div className="relative">
                {(session?.user as any)?.emailVerified === false && (
                  <Link href={`/${(session.user as any).username || "settings"}/settings`}>
                    <AlertCircle className="absolute -right-1 -top-1 h-3 w-3 text-amber-500" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    const u = (session?.user as any)?.username;
                    router.push(u ? `/${u}` : "/profile");
                  }}
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={avatarSrc || (session?.user as any)?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="text-xs">
                      {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </>
          )}

          {!session?.user && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/register">
                <Button size="sm" className="h-8 px-3 text-xs">Get started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>

      <MobileNav />
    </>
  );
}
