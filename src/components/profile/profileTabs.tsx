"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scrollArea";

const TABS = [
  { label: "Overview", href: "" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Activity", href: "/activity" },
  { label: "Achievements", href: "/achievements" },
];

interface Props {
  username: string;
}

export default function ProfileTabs({ username }: Props) {
  const pathname = usePathname();
  const basePath = `/${username}`;

  return (
    <div className="mb-6">
      <ScrollArea className="w-full">
        <div className="flex gap-1 border-b border-border pb-px">
          {TABS.map((tab) => {
            const href = tab.href ? `${basePath}${tab.href}` : basePath;
            const isActive = tab.href === ""
              ? pathname === basePath
              : pathname.startsWith(`${basePath}${tab.href}`);

            return (
              <Link
                key={tab.label}
                href={href}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-text"
                    : "text-muted hover:text-text"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
