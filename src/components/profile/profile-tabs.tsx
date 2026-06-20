"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Activity", href: "/activity" },
  { label: "Achievements", href: "/achievements" },
];

export default function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();
  const base = `/${username}`;

  return (
    <nav className="mt-6 flex gap-0 border-b border-border">
      {tabs.map((tab) => {
        const href = base + tab.href;
        const isActive = tab.href === ""
          ? pathname === base
          : pathname.startsWith(base + tab.href);
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              "px-4 py-2.5 text-xs font-medium transition-colors",
              isActive
                ? "border-b-2 border-primary text-text"
                : "text-muted hover:text-text",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
