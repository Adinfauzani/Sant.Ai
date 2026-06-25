"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { User, Shield, Palette, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { label: "Profile", href: `/${(session?.user as { username?: string } | undefined)?.username || "profile"}`, icon: User },
    { label: "Security", href: "/security", icon: Shield },
    { label: "Appearance", href: "/appearance", icon: Palette },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ];

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 md:w-48">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              isActive
                ? "bg-surface/20 text-text"
                : "text-muted hover:bg-surface/10 hover:text-text",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
