"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderGit2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@santai/ui/scrollArea";

import { PROFILE_TABS, type ProfileTabKey } from "@/lib/profileTabs";

const TAB_ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  FolderGit2,
  FileText,
};

interface Props {
  username: string;
  defaultTab: ProfileTabKey;
  sidebar?: React.ReactNode;
  children: React.ReactNode[];
}

export default function ProfileTabs({ username, defaultTab, sidebar, children }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<ProfileTabKey>(defaultTab);

  function selectTab(key: ProfileTabKey) {
    setActive(key);
    const base = `/${username}`;
    router.replace(key === "overview" ? base : `${base}?tab=${key}`, { scroll: false });
  }

  return (
    <div>
      <ScrollArea className="w-full">
        <div className="flex gap-1 border-b border-border pb-px">
          {PROFILE_TABS.map((tab) => {
            const isActive = tab.key === active;
            const Icon = TAB_ICONS[tab.icon] ?? LayoutDashboard;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectTab(tab.key)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-text" : "text-muted hover:text-text",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {sidebar}
        <main className="min-w-0 flex-1">
          {children.map((panel, i) => (
            <div key={PROFILE_TABS[i].key} className={cn(PROFILE_TABS[i].key !== active && "hidden")}>
              {panel}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
