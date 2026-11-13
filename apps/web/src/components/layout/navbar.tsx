"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth/authClient";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@santai/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@santai/ui/avatar";
import { getAvatarUrl } from "@/lib/profile/gravatar";
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
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/about" },
    { label: "Showcase", href: "/showcase" },
    { label: "Komunitas", href: "/community" },
    ...(session?.user
      ? [
          { label: "Kolaborator", href: "/people" },
          { label: "Hub", href: "/hub" },
        ]
      : []),
    ...(session?.user && ALLOWED_DASHBOARD.has((session.user as any).role)
      ? [{ label: "Dasbor", href: "/dashboard" }]
      : []),
  ];

  const mores = [
    { label: "Acara", href: "/events" },
    { label: "AI MU", href: "/ai" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 hidden border-b border-border bg-background/80 backdrop-blur-xl md:block">
        <ScientificBackground variant="grid" className="absolute inset-0 opacity-30" />
        <div className="container-main relative flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Sant.Ai — beranda"
            className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src="/assets/Sant.ai.png"
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] rounded-md"
            />
            <span className="font-heading text-sm font-semibold tracking-tight text-text">
              Sant.Ai
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                    active
                      ? "bg-surface font-medium text-text"
                      : "text-muted hover:bg-surface/60 hover:text-text",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <MoresNavDropdown items={mores} />
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              aria-label="Ganti tema terang / gelap"
              title="Ganti tema"
              className="relative flex h-7 w-[58px] items-center rounded-full border border-border bg-surface px-1 text-muted transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <SunIcon className="pointer-events-none absolute left-[7px] h-3.5 w-3.5 text-warning" />
              <MoonIcon className="pointer-events-none absolute right-[7px] h-3.5 w-3.5 text-muted-foreground" />
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-card shadow-sm ring-1 ring-border transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  theme === "dark" ? "translate-x-[30px]" : "translate-x-0",
                )}
              />
            </button>

            {session?.user && (
              <>
                <AiMuNavButton />
                <NotificationBell />

                <div className="relative">
                  {(session?.user as any)?.emailVerified === false && (
                    <Link
                      href={`/${(session.user as any).username || "settings"}/settings`}
                      aria-label="Verifikasi email kamu"
                      title="Verifikasi email kamu"
                      className="absolute -right-1 -top-1 z-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-warning" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const u = (session?.user as any)?.username;
                      router.push(u ? `/${u}` : "/profile");
                    }}
                    aria-label="Buka profil kamu"
                    className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={avatarSrc || (session?.user as any)?.image || ""}
                        alt={session?.user?.name || ""}
                      />
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
                <Link
                  href="/login"
                  className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-text"
                >
                  Masuk
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-8 px-3 text-xs">
                    Mulai Sekarang
                  </Button>
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
